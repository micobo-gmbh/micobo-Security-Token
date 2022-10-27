const truffleAssert = require("truffle-assertions")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
// we use the json file here to use this contract with web3 natively
// truffle would not find its artifact when running tests and also coverage checks
// because it is not part of the "sale" truffle project (truffle-config-sale.js)
const Sale = artifacts.require("SaleDeferred")

const { conf, mock } = require("../../token-config")

contract("Test Deployment", async (accounts) => {
	let contracts

	before(async () => {
		const networkId = await web3.eth.net.getId()

		contracts = {
			securityToken: new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address),
		}
	})

	let sale

	it("deploy sale contract", async () => {
		sale = await Sale.new(
			accounts[0],
			contracts.securityToken.options.address,
			mock.whitelistAddress,
			mock.primaryMarketEndTimestamp,
			mock.cap,
			conf.standardPartition,
			mock.zeroWallet,
			mock.EIP712Name
		)
	})

	it("sale contract gives me all the correct info", async () => {
		assert.deepEqual(await sale.issuer(), accounts[0])

		assert.deepEqual((await sale.cap()).toNumber(), mock.cap)

		assert.deepEqual((await sale.sold()).toNumber(), 0)

		assert.deepEqual((await sale.primaryMarketEnd()).toNumber(), mock.primaryMarketEndTimestamp)

		assert.deepEqual(await sale.partition(), conf.standardPartition)

		assert.deepEqual(await sale.getTokenAddress(), contracts.securityToken.options.address)

		assert.deepEqual(await sale.getWhitelistAddress(), mock.whitelistAddress)

		assert.deepEqual(await sale.getBuyers(), [])
	})

	it("cannot create sale contract with primaryMarketEndTimestamp in the past", async () => {
		await truffleAssert.fails(
			Sale.new(
				accounts[0],
				contracts.securityToken.options.address,
				mock.whitelistAddress,
				0,
				mock.cap,
				conf.standardPartition,
				mock.zeroWallet,
				mock.EIP712Name
			),
			truffleAssert.ErrorType.REVERT,
			"primary market end in the past"
		)
	})
})
