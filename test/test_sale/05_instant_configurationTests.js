const truffleAssert = require("truffle-assertions")
const Sale = artifacts.require("SaleInstant")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")

const { Role } = require("../Constants")
const { conf, mock } = require("../../token-config")

contract("Test Instant Configuration", async (accounts) => {
	let sale, securityToken

	const amount = 100

	const rate = 1000000

	before(async () => {
		const networkId = await web3.eth.net.getId()

		securityToken = new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address)

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

		await securityToken.methods
			.setModulesByPartition(conf.standardPartition, [whitelist.options.address])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// deploy Sale
		sale = await Sale.new(
			accounts[0],
			securityToken.options.address,
			whitelist.options.address,
			mock.primaryMarketEndTimestamp,
			mock.cap,
			conf.standardPartition,
			mock.zeroWallet,
			mock.EIP712Name
		)

		// make sale contract issuer
		await securityToken.methods.addRole(Role.ISSUER, sale.address).send({ from: accounts[0], gasLimit: 1000000 })
	})

	it("cannot add fiat purchase if not admin", async () => {
		truffleAssert.fails(sale.addFiatPurchase(accounts[1], amount), truffleAssert.ErrorType.REVERT, "!SALE_ADMIN")
	})

	it("cannot add fiat purchase if address zero", async () => {
		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0] })

		await truffleAssert.fails(
			sale.addFiatPurchase("0x0000000000000000000000000000000000000000", amount),
			truffleAssert.ErrorType.REVERT,
			"buyer is zero"
		)
	})

	it("cannot add fiat purchase if not whitelisted", async () => {
		// use non-zero address
		await truffleAssert.fails(
			sale.addFiatPurchase(accounts[1], amount),
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
			sale.addFiatPurchase(accounts[1], amount * 100),
			truffleAssert.ErrorType.REVERT,
			"would exceed sales cap"
		)
	})

	it("cannot add fiat purchase if it exceeds allowed limit", async () => {
		await truffleAssert.fails(
			sale.addFiatPurchase(accounts[1], amount),
			truffleAssert.ErrorType.REVERT,
			"exceeds purchase limit for buyer"
		)
	})

	it("can add fiat purchase", async () => {
		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount * 2)

		assert.deepEqual((await sale.getPurchase(accounts[1])).toNumber(), 0)
		assert.deepEqual(await sale.getBuyers(), [])

		await sale.addFiatPurchase(accounts[1], amount)

		assert.deepEqual((await sale.getPurchase(accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(), [accounts[1]])
	})

	it("admin can edit currency rates", async () => {
		assert.deepEqual((await sale.getCurrencyRate(mock.currencyAddress)).toNumber(), 0)

		await truffleAssert.fails(
			sale.editCurrencyRates(mock.currencyAddress, rate, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await sale.editCurrencyRates(mock.currencyAddress, rate)

		assert.deepEqual((await sale.getCurrencyRate(mock.currencyAddress)).toNumber(), rate)
	})

	it("can edit primaryMarketEnd", async () => {
		assert.deepEqual((await sale.primaryMarketEnd()).toNumber(), mock.primaryMarketEndTimestamp)

		await truffleAssert.fails(
			sale.editPrimaryMarketEnd(mock.primaryMarketEndTimestamp + 100, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"!SALE_ADMIN"
		)

		await truffleAssert.fails(sale.editPrimaryMarketEnd(100), truffleAssert.ErrorType.REVERT, "not in future")

		await sale.editPrimaryMarketEnd(mock.primaryMarketEndTimestamp + 100)

		assert.deepEqual((await sale.primaryMarketEnd()).toNumber(), mock.primaryMarketEndTimestamp + 100)
	})
})
