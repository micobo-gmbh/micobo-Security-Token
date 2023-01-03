const truffleAssert = require("truffle-assertions")
const UniSale = artifacts.require("UniSale")
const uniSaleJSON = require("../../build/contracts/UniSale.json")
const proxyJSON = require("../../build/contracts/InitializableAdminUpgradeabilityProxy.json")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")

const { Role } = require("../test_token/Constants")
const { conf, mock } = require("../../token-config")

contract("Test Deferred Purchase Premint", async (accounts) => {
	let sale, securityToken

	const amount = 100

	const rate = 1

	const premintWallet = accounts[9]

	const nrOfInvestors = 101 // should be more than batchSize

	before(async () => {
		const networkId = await web3.eth.net.getId()

		securityToken = new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address)
		tokenAddress = securityToken.options.address

		// use our own token as test currency (non-proxy)
		currencyToken = new web3.eth.Contract(securityTokenJSON.abi)

		currencyToken = await currencyToken
			.deploy({
				data: securityTokenJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		await currencyToken.methods
			.initialize(
				"Test Stablecoin",
				"TST",
				1, // granularity
				conf.standardCap,
				accounts[0], // admin
				accounts[7], // controller
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)
			.send({ from: accounts[0], gasLimit: 1000000 })

		// issue some test coins
		await currencyToken.methods
			.issueByPartition(conf.standardPartition, accounts[1], amount, "0x")
			.send({ from: accounts[0], gasLimit: 1000000 })

		// new whitelist module
		whitelist = new web3.eth.Contract(whitelistConstraintModuleJSON.abi)
		whitelist = await whitelist
			.deploy({
				data: whitelistConstraintModuleJSON.bytecode,
				arguments: [securityToken.options.address],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		// deploy new UniSale proxy
		const uniSaleContract = new web3.eth.Contract(uniSaleJSON.abi)
		const data = uniSaleContract.methods.initialize().encodeABI()
		saleLogic = await UniSale.new()
		let proxy = new web3.eth.Contract(proxyJSON.abi)
		proxy = await proxy
			.deploy({ data: proxyJSON.bytecode, arguments: [] })
			.send({ from: accounts[0], gas: 9000000 })
		await proxy.methods.initialize(saleLogic.address, accounts[9], data).send({from: accounts[0], gas: 9000000})
		sale = await UniSale.at(proxy.options.address)

		await securityToken.methods
			.setModulesByPartition(conf.standardPartition, [whitelist.options.address])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// issue tokens to premintWallet
		securityToken.methods
			.issueByPartition(conf.standardPartition, premintWallet, amount, "0x0")
			.send({ from: accounts[0], gasLimit: 1000000 })

		// make sale contract controller
		await securityToken.methods.addRole(Role.CONTROLLER, sale.address).send({ from: accounts[0] })

		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0] })

		// make whitelist editor
		await securityToken.methods.addRole(Role.WHITELIST_EDITOR, accounts[0]).send({ from: accounts[0] })
		// whitelist user
		await whitelist.methods.editWhitelist(accounts[1], true).send({ from: accounts[0] })
	})

	it("cannot purchase tokens with unregistered currency", async () => {
		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(
				tokenAddress,
				conf.standardPartition,
				currencyToken.options.address,
				amount,
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"this stablecoin is not accepted"
		)
	})

	it("cannot purchase tokens with allowance too low", async () => {
		// our test coin has 0 decimals
		// with the rate set to to 1, you can buy 1 token for 1 test coin
		// add sales channel
		await sale.addSalesChannel(
			tokenAddress, // tokenAddress
			accounts[0], //issuerWallet
			whitelist.options.address, // whitelistAddress
			mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
			conf.standardCap, // saleCap, for mass testing
			conf.standardPartition, //partition
			premintWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
			currencyToken.options.address, //currencyAddress
			rate, // rate
			true, // useDeferredMinting
			false // useLimit
		)

		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(
				tokenAddress,
				conf.standardPartition,
				currencyToken.options.address,
				amount,
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"stablecoin allowance too low"
		)

		await currencyToken.methods.approve(sale.address, amount).send({ from: accounts[1] })
		assert.deepEqual(parseInt(await currencyToken.methods.allowance(accounts[1], sale.address).call()), amount)

		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(
				tokenAddress,
				conf.standardPartition,
				currencyToken.options.address,
				amount + 1,
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"stablecoin allowance too low"
		)
	})

	it("can purchase tokens with allowance", async () => {
		await sale.purchaseTokenWithAllowance(
			tokenAddress,
			conf.standardPartition,
			currencyToken.options.address,
			amount,
			{ from: accounts[1] }
		)

		// see if purchase has happened
		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(tokenAddress, conf.standardPartition), [accounts[1]])

		// see if coins we transferred correctly
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[1]).call()), 0)
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[0]).call()), amount)
	})

	it("cannot claim tokens if primary market not over", async () => {
		await truffleAssert.fails(
			sale.claimTokens(tokenAddress, conf.standardPartition, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"primary market has not ended yet"
		)
	})

	it("cannot claim tokens if none purchased", async () => {
		let now = new Date().getTime()
		now = (now / 1000).toFixed(0)

		// set the primaryMarketEnd to 1 second from now
		await sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, now - -1)

		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		// wait 2 seconds
		await sleep(2000)

		// trigger a transaction to advance blocktime (this is only needed because testnets mine blocks only when needed)
		await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0], value: web3.utils.toWei("1") })

		await truffleAssert.fails(
			sale.claimTokens(tokenAddress, conf.standardPartition, { from: accounts[2] }),
			truffleAssert.ErrorType.REVERT,
			"no tokens to claim"
		)
	})

	it("can claim tokens", async () => {
		await sale.claimTokens(tokenAddress, conf.standardPartition, { from: accounts[1] })

		// check purchase mapping
		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), 0)

		// check new token balance
		assert.deepEqual(parseInt(await securityToken.methods.balanceOf(accounts[1]).call()), amount)
	})

	it("can distribute tokens en masse", async () => {
		// issue tokens to premintWallet
		await securityToken.methods
			.issueByPartition(conf.standardPartition, premintWallet, amount * nrOfInvestors, "0x0")
			.send({ from: accounts[0], gasLimit: 1000000 })

		let now = new Date().getTime()
		now = (now / 1000).toFixed(0)

		// set the primaryMarketEnd to far in the future
		await sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, now - -1000000)

		for (i = 0; i < nrOfInvestors; i++) {
			account = web3.eth.accounts.create("entropy" + i)

			// whitelist user
			await whitelist.methods.editWhitelist(account.address, true).send({ from: accounts[0], gasLimit: 1000000 })

			// increase limit for buyer
			await sale.editPurchaseLimits(tokenAddress, conf.standardPartition, account.address, amount)

			// add purchase
			await sale.addFiatPurchase(tokenAddress, conf.standardPartition, account.address, amount)
		}

		assert.deepEqual((await sale.getBuyers(tokenAddress, conf.standardPartition)).length, nrOfInvestors - -1) // plus the one from test before

		// cannot start until primary market has ended
		await truffleAssert.fails(
			sale.distributeTokens(tokenAddress, conf.standardPartition, 100),
			truffleAssert.ErrorType.REVERT,
			"primary market has not ended yet"
		)

		now = new Date().getTime()
		now = (now / 1000).toFixed(0)

		// set the primaryMarketEnd to 1 second from now
		await sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, now - -1)

		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		// wait 2 seconds
		await sleep(2000)

		// trigger a transaction to advance blocktime (this is only needed because testnets mine blocks only when needed)
		await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0], value: web3.utils.toWei("1") })

		doneDistributing = false

		while (!doneDistributing) {
			try {
				await sale.distributeTokens(tokenAddress, conf.standardPartition, 100)
			} catch (e) {
				assert.deepEqual(e.reason, "done distributing")
				doneDistributing = true
			}
		}

		// check balance of last account
		assert.deepEqual(parseInt(await securityToken.methods.balanceOf(account.address).call()), amount)

		assert.deepEqual(parseInt(await securityToken.methods.totalSupply().call()), amount * (nrOfInvestors - -1))
	})
})
