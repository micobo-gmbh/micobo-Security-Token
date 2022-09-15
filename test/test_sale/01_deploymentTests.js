const SecurityToken = artifacts.require("SecurityToken")
const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")
const securityTokenABI = require("../../build/contracts/SecurityToken.json").abi
const truffleAssert = require("truffle-assertions")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
const Sale = artifacts.require("Sale")

const { conf } = require("../../token-config")

contract("Test Deployment", async (accounts) => {
	let contracts

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			securityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}
	})

	let securityToken, securityTokenFactory, sale, proxyAddress

	const mockWhitelistAddress = "0x01FaF3688dee393837fe88Fd589E830c8f3D5B8e"
	const mockCap = 1000
	const mockPrimaryMarketEndTimestamp = 1694234541

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

	it("deploy sale contract", async () => {
		sale = await Sale.new(
			accounts[0],
			securityToken.address,
			mockWhitelistAddress,
			mockPrimaryMarketEndTimestamp,
			mockCap,
			conf.standardPartition
		)
	})

	it("sale contract gives me all the correct info", async () => {
		assert.deepEqual(await sale.issuer(), accounts[0])

		assert.deepEqual((await sale.cap()).toNumber(), mockCap)

		assert.deepEqual((await sale.sold()).toNumber(), 0)

		assert.deepEqual((await sale.primaryMarketEnd()).toNumber(), mockPrimaryMarketEndTimestamp)

		assert.deepEqual(await sale.partition(), conf.standardPartition)

		assert.deepEqual(await sale.distributed(), false)

		assert.deepEqual(await sale.getTokenAddress(), securityToken.address)

		assert.deepEqual(await sale.getWhitelistAddress(), mockWhitelistAddress)

		assert.deepEqual(await sale.getBuyers(), [])
	})

	it("cannot create sale contract with primaryMarketEndTimestamp in the past", async () => {
		truffleAssert.fails(
			Sale.new(accounts[0], securityToken.address, mockWhitelistAddress, 0, mockCap, conf.standardPartition),
			truffleAssert.ErrorType.REVERT,
			"primary market end in the past"
		)
	})
})
