const SecurityToken = artifacts.require("SecurityToken")
const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")
const securityTokenABI = require("../build/contracts/SecurityToken.json").abi

const { conf } = require("../token-config")

contract("Test Deployment", async (accounts) => {
	let securityToken, securityTokenFactory

	let micoboSecurityToken = new web3.eth.Contract(securityTokenABI)

	// encode ABI for init function (former constructor)
	let data = micoboSecurityToken.methods
		.initialize(
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
		.encodeABI()

	it("deploy security token successfully", async () => {
		securityToken = await SecurityToken.new()
	})

	it("deploy security token factory successfully", async () => {
		// the implementation is the master security token contract
		securityTokenFactory = await SecurityTokenFactory.new(securityToken.address)
	})

	it("deploy security token proxy successfully", async () => {
		await securityTokenFactory.deployNewSecurityToken(Math.floor(Math.random() * 10 + 1), accounts[9], data)
	})

	/* it("deploys micobo security token", async () => {
		// granularity should be at least 1
		await truffleAssert.fails(
			SecurityToken.new(
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

		micoboSecurityToken = await SecurityToken.new(
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
	}) */

	/* it("Token gives me all the correct token information", async () => {
		assert.deepEqual(await micoboSecurityToken.name(), conf.name)

		assert.deepEqual(await micoboSecurityToken.symbol(), conf.symbol)

		assert.deepEqual((await micoboSecurityToken.granularity()).toNumber(), conf.granularity)

		assert.deepEqual((await micoboSecurityToken.decimals()).toNumber(), 0)

		assert.deepEqual(await micoboSecurityToken.controllers(), [])

		// total cap should be equal to standard partition cap at this point
		assert.deepEqual((await micoboSecurityToken.cap()).toNumber(), conf.standardCap)

		assert.deepEqual((await micoboSecurityToken.totalSupply()).toNumber(), 0)
	}) */
})
