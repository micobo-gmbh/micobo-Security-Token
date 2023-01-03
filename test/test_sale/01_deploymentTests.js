// we use the json file here to use this contract with web3 natively
// truffle would not find its artifact when running tests and also coverage checks
// because it is not part of the "sale" truffle project (truffle-config-sale.js)
const UniSale = artifacts.require("UniSale")
const uniSaleJSON = require("../../build/contracts/UniSale.json")
const proxyJSON = require("../../build/contracts/InitializableAdminUpgradeabilityProxy.json")

contract("Test Deployment", async (accounts) => {
	it("deploy sale contract logic", async () => {
		const uniSaleContract = new web3.eth.Contract(uniSaleJSON.abi)

		const data = uniSaleContract.methods.initialize().encodeABI()

		const saleLogic = await UniSale.new()

		// we create a web3 contract here to explicitly CALL "implementation" instead of sending a transaction.
		// Because of the old "nonpayable" stateMutability status,
		// Truffle(and also Etherscan) treat it as a "write" function, when it is not
		let proxy = new web3.eth.Contract(proxyJSON.abi)
		proxy = await proxy
			.deploy({
				data: proxyJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		await proxy.methods.initialize(saleLogic.address, accounts[9], data).send({ from: accounts[0], gas: 9000000 })

		const impl = await proxy.methods.implementation().call({ from: accounts[9] })

		assert.deepEqual(impl, saleLogic.address)
	})
})
