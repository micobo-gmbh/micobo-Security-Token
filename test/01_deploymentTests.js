const truffleAssert = require("truffle-assertions")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const { conf } = require("../token-config")

contract("Test Deployment", async (accounts) => {
	let micoboSecurityToken

	// deepEqual compares with '==='

	it("deploys micobo security token", async () => {
		// granularity should be at least 1
		await truffleAssert.fails(
			MicoboSecurityToken.new(
				conf.name,
				conf.symbol,
				0,
				conf.standardCap,
				accounts[0],
				accounts[0],
				accounts[0],
				accounts[0],
				accounts[0]
			),
			truffleAssert.ErrorType.REVERT,
			"granularity"
		)

		micoboSecurityToken = await MicoboSecurityToken.new(
			conf.name,
			conf.symbol,
			conf.granularity,
			conf.standardCap,
			accounts[0],
			accounts[0],
			accounts[0],
			accounts[0],
			accounts[0]
		)
	})

	it("Token gives me all the correct token information", async () => {
		assert.deepEqual(await micoboSecurityToken.name(), conf.name)

		assert.deepEqual(await micoboSecurityToken.symbol(), conf.symbol)

		assert.deepEqual((await micoboSecurityToken.granularity()).toNumber(), conf.granularity)

		assert.deepEqual((await micoboSecurityToken.decimals()).toNumber(), 0)

		assert.deepEqual(await micoboSecurityToken.controllers(), [])

		// total cap should be equal to standard partition cap at this point
		assert.deepEqual((await micoboSecurityToken.cap()).toNumber(), conf.standardCap)

		assert.deepEqual((await micoboSecurityToken.totalSupply()).toNumber(), 0)
	})
})
