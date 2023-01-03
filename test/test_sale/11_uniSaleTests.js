const truffleAssert = require("truffle-assertions")
const UniSale = artifacts.require("UniSale")
const uniSaleJSON = require("../../build/contracts/UniSale.json")
const proxyJSON = require("../../build/contracts/InitializableAdminUpgradeabilityProxy.json")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
const usdcJSON = require("../../build/contracts/UChildERC20.json")

const { Role } = require("../test_token/Constants")
const { conf, mock } = require("../../token-config")

contract("Test UniSale", async (accounts) => {
	let sale, securityToken, tokenAddress

	const amount = 100

	const currencyName = "USD Coin (PoS)"
	const usdcDecimals = 6

	const rate = (2 * 10) ^ usdcDecimals // 1 token for 2 dollar

	before(async () => {
		const networkId = await web3.eth.net.getId()

		securityToken = new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address)
		tokenAddress = securityToken.options.address

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

		tx = await securityToken.methods
			.setModulesByPartition(conf.standardPartition, [whitelist.options.address])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// deploy test USDC token
		currencyToken = new web3.eth.Contract(usdcJSON.abi)
		currencyToken = await currencyToken
			.deploy({
				data: usdcJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		// init, make account 0 "childChainManager" who can deposit/mint tokens
		await currencyToken.methods
			.initialize(currencyName, "USDC", usdcDecimals, accounts[0])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// issue some test coins
		let depositData = web3.eth.abi.encodeParameter("uint256", amount * rate)
		await currencyToken.methods.deposit(accounts[1], depositData).send({ from: accounts[0], gasLimit: 1000000 })

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

		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0], gasLimit: 1000000 })

		// make sale contract issuer
		await securityToken.methods.addRole(Role.ISSUER, sale.address).send({ from: accounts[0], gasLimit: 1000000 })
	})

	it("can create a new sale channel", async () => {
		await sale.addSalesChannel(
			tokenAddress, // tokenAddress
			accounts[9], //issuerWallet
			whitelist.options.address, // whitelistAddress
			mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
			mock.cap, // saleCap, for mass testing
			conf.standardPartition, //partition
			mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
			currencyToken.options.address, //currencyAddress
			rate, // rate
			true, // useDeferredMinting
			true // useLimit
		)
	})

	it("gets whitelist address correctly", async () => {
		const whitelistAddress = await sale.getWhitelistAddress(tokenAddress, conf.standardPartition)

		assert.deepEqual(whitelist.options.address, whitelistAddress)
	})

	it("cannot create a new sale channel, if issuer wallet zero", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				tokenAddress, // tokenAddress
				mock.zeroWallet, //issuerWallet
				whitelist.options.address, // whitelistAddress
				mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				rate, // rate
				true, // useDeferredMinting
				true // useLimit
			),
			truffleAssert.ErrorType.REVERT,
			"issuerWallet zero"
		)
	})

	it("cannot create a new sale channel, if token address is not a ERC1400", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				mock.notAContract, // tokenAddress
				accounts[0], //issuerWallet
				whitelist.options.address, // whitelistAddress
				mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				rate, // rate
				true, // useDeferredMinting
				true // useLimit
			),
			truffleAssert.ErrorType.REVERT,
			"token is not ERC1400 compatible"
		)
	})

	it("cannot create a new sale channel, if whitelist address is not a contract", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				tokenAddress, // tokenAddress
				accounts[0], //issuerWallet
				mock.notAContract, // whitelistAddress
				mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				rate, // rate
				true, // useDeferredMinting
				true // useLimit
			),
			truffleAssert.ErrorType.REVERT,
			"whitelist is not a contract"
		)
	})

	it("cannot create a new sale channel, if primary market ends in past", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				tokenAddress, // tokenAddress
				accounts[0], //issuerWallet
				whitelist.options.address, // whitelistAddress
				0, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				rate, // rate
				true, // useDeferredMinting
				true // useLimit
			),
			truffleAssert.ErrorType.REVERT,
			"primary market end in the past"
		)
	})

	it("cannot create a new sale channel, if rate is 0", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				tokenAddress, // tokenAddress
				accounts[0], //issuerWallet
				whitelist.options.address, // whitelistAddress
				mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				0, // rate
				true, // useDeferredMinting
				true // useLimit
			),
			truffleAssert.ErrorType.REVERT,
			"rate cannot be 0"
		)
	})

	it("cannot create a new sale channel, if not sales admin", async () => {
		await truffleAssert.fails(
			sale.addSalesChannel(
				tokenAddress, // tokenAddress
				accounts[0], //issuerWallet
				whitelist.options.address, // whitelistAddress
				mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
				mock.cap, // saleCap, for mass testing
				conf.standardPartition, //partition
				mock.zeroWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
				currencyToken.options.address, //currencyAddress
				rate, // rate
				true, // useDeferredMinting
				true, // useLimit
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)
	})

	it("can delete sales channel if admin", async () => {
		await truffleAssert.fails(
			sale.deleteSalesChannel(tokenAddress, conf.standardPartition, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await truffleAssert.passes(sale.deleteSalesChannel(tokenAddress, conf.standardPartition))
	})
})
