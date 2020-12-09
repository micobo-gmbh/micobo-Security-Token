const SecurityToken = artifacts.require("SecurityToken")
// const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")
const securityTokenABI = require("../build/contracts/SecurityToken.json").abi
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { conf } = require("../token-config")

contract("Test Deployment", async (accounts) => {
	let contracts

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			securityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}
	})

	/* let securityToken, securityTokenFactory

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
	}) */

	it("Token gives me all the correct token information", async () => {
		assert.deepEqual(await contracts.securityToken.name(), conf.name)

		assert.deepEqual(await contracts.securityToken.symbol(), conf.symbol)

		assert.deepEqual((await contracts.securityToken.granularity()).toNumber(), conf.granularity)

		assert.deepEqual((await contracts.securityToken.decimals()).toNumber(), 0)

		// assert.deepEqual(await contracts.securityToken.controllers(), [])

		// total cap should be equal to standard partition cap at this point
		assert.deepEqual((await contracts.securityToken.cap()).toNumber(), conf.standardCap)

		assert.deepEqual((await contracts.securityToken.totalSupply()).toNumber(), 0)
	})
})
