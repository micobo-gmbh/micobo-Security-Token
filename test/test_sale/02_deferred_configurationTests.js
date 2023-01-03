const truffleAssert = require("truffle-assertions")
const UniSale = artifacts.require("UniSale")
const uniSaleJSON = require("../../build/contracts/UniSale.json")
const proxyJSON = require("../../build/contracts/InitializableAdminUpgradeabilityProxy.json")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")

const { Role } = require("../test_token/Constants")
const { conf, mock } = require("../../token-config")

contract("Test Deferred Configuration", async (accounts) => {
	let sale, securityToken

	const amount = 100

	const rate = 1000000

	before(async () => {
		const networkId = await web3.eth.net.getId()

		securityToken = new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address)
		tokenAddress = securityToken.options.address

		whitelist = new web3.eth.Contract(whitelistConstraintModuleJSON.abi)
		whitelist = await whitelist
			.deploy({ data: whitelistConstraintModuleJSON.bytecode, arguments: [securityToken.options.address] })
			.send({ from: accounts[0], gas: 9000000 })

		tx = await securityToken.methods
			.setModulesByPartition(conf.standardPartition, [whitelist.options.address])
			.send({ from: accounts[0], gasLimit: 1000000 })

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
	})

	it("cannot add fiat purchase if not admin", async () => {
		await truffleAssert.fails(
			sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)
	})

	it("cannot add fiat purchase if address zero", async () => {
		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0] })

		await truffleAssert.fails(
			sale.addFiatPurchase(
				tokenAddress,
				conf.standardPartition,
				"0x0000000000000000000000000000000000000000",
				amount
			),
			truffleAssert.ErrorType.REVERT,
			"buyer is zero"
		)
	})

	it("can add sales channel", async () => {
		await sale.addSalesChannel(
			tokenAddress, // tokenAddress
			accounts[0], //issuerWallet
			whitelist.options.address, // whitelistAddress
			mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
			mock.cap, // saleCap, for mass testing
			conf.standardPartition, //partition
			mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
			mock.currencyAddress, //currencyAddress
			rate, // rate
			true, // useDeferredMinting
			true // useLimit
		)
	})

	it("cannot add fiat purchase if not whitelisted", async () => {
		// use non-zero address
		await truffleAssert.fails(
			sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount),
			truffleAssert.ErrorType.REVERT,
			"buyer not whitelisted"
		)
	})

	it("cannot add fiat purchase if it exceeds cap", async () => {
		// make whitelist editor
		await securityToken.methods.addRole(Role.WHITELIST_EDITOR, accounts[0]).send({ from: accounts[0] })

		// whitelist user
		await whitelist.methods.editWhitelist(accounts[1], true).send({ from: accounts[0] })

		await truffleAssert.fails(
			sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount * 100),
			truffleAssert.ErrorType.REVERT,
			"would exceed sales cap"
		)
	})

	it("cannot add fiat purchase if it exceeds allowed limit", async () => {
		await truffleAssert.fails(
			sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount),
			truffleAssert.ErrorType.REVERT,
			"exceeds purchase limit for buyer"
		)
	})

	it("can add fiat purchase", async () => {
		// increase limit for buyer
		await sale.editPurchaseLimits(tokenAddress, conf.standardPartition, accounts[1], amount * 2)

		await truffleAssert.fails(
			sale.editPurchaseLimits(tokenAddress, conf.standardPartition, mock.zeroWallet, amount),
			truffleAssert.ErrorType.REVERT,
			"buyer is zero"
		)

		assert.deepEqual(
			(await sale.getLimit(tokenAddress, conf.standardPartition, accounts[1])).toNumber(),
			amount * 2
		)

		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), 0)
		assert.deepEqual(await sale.getBuyers(tokenAddress, conf.standardPartition), [])

		await sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount)

		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(tokenAddress, conf.standardPartition), [accounts[1]])
	})

	it("purchases add up", async () => {
		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), amount)

		await sale.addFiatPurchase(tokenAddress, conf.standardPartition, accounts[1], amount)

		assert.deepEqual(
			(await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(),
			amount * 2
		)
	})

	it("admin can edit currency rates", async () => {
		assert.deepEqual(
			(await sale.getCurrencyRate(tokenAddress, conf.standardPartition, mock.currencyAddress)).toNumber(),
			rate
		)

		await truffleAssert.fails(
			sale.editCurrencyRates(tokenAddress, conf.standardPartition, mock.currencyAddress, rate, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await sale.editCurrencyRates(tokenAddress, conf.standardPartition, mock.currencyAddress, rate - 1)

		assert.deepEqual(
			(await sale.getCurrencyRate(tokenAddress, conf.standardPartition, mock.currencyAddress)).toNumber(),
			rate - 1
		)

		// set it back
		await sale.editCurrencyRates(tokenAddress, conf.standardPartition, mock.currencyAddress, rate)

		assert.deepEqual(
			(await sale.getCurrencyRate(tokenAddress, conf.standardPartition, mock.currencyAddress)).toNumber(),
			rate
		)
	})

	it("can cancel Purchase", async () => {
		assert.deepEqual(
			(await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(),
			amount * 2
		)

		await truffleAssert.fails(
			sale.cancelPurchase(tokenAddress, conf.standardPartition, accounts[1], amount, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await sale.cancelPurchase(tokenAddress, conf.standardPartition, accounts[1], amount)

		await truffleAssert.fails(
			sale.cancelPurchase(tokenAddress, conf.standardPartition, accounts[1], amount * 2),
			truffleAssert.ErrorType.REVERT,
			"amount too high"
		)

		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), amount)
	})

	it("can edit primaryMarketEnd", async () => {
		assert.deepEqual(
			(await sale.getPrimaryMarketEndTimestamp(tokenAddress, conf.standardPartition)).toNumber(),
			mock.primaryMarketEndTimestamp
		)

		await truffleAssert.fails(
			sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, mock.primaryMarketEndTimestamp + 100, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await truffleAssert.fails(
			sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, 100),
			truffleAssert.ErrorType.REVERT,
			"not in future"
		)

		await sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, mock.primaryMarketEndTimestamp + 100)

		assert.deepEqual(
			(await sale.getPrimaryMarketEndTimestamp(tokenAddress, conf.standardPartition)).toNumber(),
			mock.primaryMarketEndTimestamp + 100
		)
	})
})
