const truffleAssert = require("truffle-assertions")
const Sale = artifacts.require("SaleInstant")
const SecurityToken = artifacts.require("SecurityToken")
const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")

const { Role } = require("../Constants")
const { conf, mock } = require("../../token-config")

contract("Test Instant Purchase", async (accounts) => {
	let sale, securityToken

	const amount = 100

	const rate = 1

	before(async () => {
		const chainId = await web3.eth.net.getId()

		securityToken = await SecurityToken.at(securityTokenJSON.networks[chainId].address)

		// use our own token as test currency (non-proxy)
		currencyToken = await SecurityToken.new()
		await currencyToken.initialize(
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

		// issue some test coins
		await currencyToken.issueByPartition(conf.standardPartition, accounts[1], amount, "0x")

		// new whitelist module
		whitelist = await WhitelistConstraintModule.new(securityToken.address)
		await securityToken.setModulesByPartition(conf.standardPartition, [whitelist.address])

		// deploy Sale
		sale = await Sale.new(
			accounts[0],
			securityToken.address,
			whitelist.address,
			mock.primaryMarketEndTimestamp,
			mock.cap,
			conf.standardPartition,
			mock.premintWallet,
			mock.EIP712Name
		)

		// issue tokens to premintWallet
		await securityToken.issueByPartition(conf.standardPartition, accounts[9], amount, "0x0")

		// add sale_admin role
		await securityToken.addRole(Role.SALE_ADMIN, accounts[0])

		// make sale contract issuer
		await securityToken.addRole(Role.ISSUER, sale.address)

		// make whitelist editor
		await securityToken.addRole(Role.WHITELIST_EDITOR, accounts[0])
		// whitelist user
		await whitelist.editWhitelist(accounts[1], true)

		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount)
	})

	it("cannot purchase tokens with unregistered currency", async () => {
		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(currencyToken.address, amount, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"this stablecoin is not accepted"
		)
	})

	it("cannot purchase tokens with allowance too low", async () => {
		// set currency rate
		// our test coin has 0 decimals
		// with the rate set to to 1, you can buy 1 token for 1 test coin
		await sale.editCurrencyRates(currencyToken.address, rate)

		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(currencyToken.address, amount, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"stablecoin allowance too low"
		)

		await currencyToken.approve(sale.address, amount, { from: accounts[1] })
		assert.deepEqual((await currencyToken.allowance(accounts[1], sale.address)).toNumber(), amount)

		await truffleAssert.fails(
			sale.purchaseTokenWithAllowance(currencyToken.address, amount + 1, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"stablecoin allowance too low"
		)
	})

	it("can purchase tokens with allowance", async () => {
		await sale.purchaseTokenWithAllowance(currencyToken.address, amount, { from: accounts[1] })

		// see if purchase has happened
		assert.deepEqual((await sale.getPurchase(accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(), [accounts[1]])

		// see if coins we transferred correctly
		assert.deepEqual((await currencyToken.balanceOf(accounts[1])).toNumber(), 0)
		assert.deepEqual((await currencyToken.balanceOf(accounts[0])).toNumber(), amount)
	})
})
