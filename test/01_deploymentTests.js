const SecurityToken = artifacts.require("SecurityToken")
const SecurityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")
const securityTokenABI = require("../build/contracts/SecurityToken.json").abi
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { conf } = require("../token-config")

contract("Test Deployment", async (accounts) => {
	let contracts

	before(async () => {
		const networkId = await web3.eth.net.getId()

		contracts = {
			securityToken: await SecurityToken.at(securityTokenJSON.networks[networkId].address),
		}
	})

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
		securityTokenFactory = new web3.eth.Contract(SecurityTokenFactoryJSON.abi)
		securityTokenFactory = await securityTokenFactory
			.deploy({
				data: SecurityTokenFactoryJSON.bytecode,
				arguments: [securityToken.address],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})
	})

	it("deploy security token proxy successfully", async () => {
		await securityTokenFactory.methods.deployNewSecurityToken(Math.floor(Math.random() * 10 + 1), accounts[9], data)
	})

	it("Token gives me all the correct token information", async () => {
		// INFO we use the contract object from the migrations here, since this is the one we will be using in the other tests as well
		// the tests above are only to test deployment, their contract instances do not persist though
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
