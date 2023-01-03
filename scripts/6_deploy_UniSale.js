const uniSaleJSON = require("../build/contracts/UniSale.json")
const proxyJSON = require("../build/contracts/InitializableAdminUpgradeabilityProxy.json")

module.exports = async (callback) => {
	try {
		const accounts = await web3.eth.getAccounts()
		const chainId = await web3.eth.getChainId()

		let uniSaleContract = new web3.eth.Contract(uniSaleJSON.abi)

		const data = uniSaleContract.methods.initialize().encodeABI()

		uniSaleContract = await uniSaleContract
			.deploy({
				data: uniSaleJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
				chainId: chainId,
			})

		console.log("Logic deployed at: ", uniSaleContract.options.address)

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
				chainId: chainId,
			})

		console.log("Proxy deployed at: ", proxy.options.address)

		await proxy.methods
			.initialize(uniSaleContract.options.address, accounts[0], data)
			.send({ from: accounts[0], gas: 9000000, chainId: chainId })

		console.log("Proxy initialized")
	} catch (e) {
		console.log(e)
	}

	callback()
}
