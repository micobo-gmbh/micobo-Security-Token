const securityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

module.exports = async (callback) => {
	try {
		const accounts = await web3.eth.getAccounts()

		let micoboSecurityToken = new web3.eth.Contract(securityTokenJSON.abi)

		// encode ABI for init function (former constructor)
		const data = micoboSecurityToken.methods
			.initialize(
				"Token Name",
				"SYMBOL",
				1, // granularity
				1000000000, // cap
				accounts[0],
				accounts[7],
				accounts[0],
				accounts[0],
				accounts[0]
			)
			.encodeABI()

		let securityTokenFactory = new web3.eth.Contract(securityTokenFactoryJSON.abi)
		securityTokenFactory.options.address = "0xaBBb6A4889CCDdb7FD8b461AC1157349c8067870"

		let receipt = await securityTokenFactory.methods
			.deployNewSecurityToken(
				Math.floor(Math.random() * 10 + 1),
				accounts[9], // proxy admin can not use the proxy itself, therefore we use account 9 here
				data
			)
			.send({
				from: accounts[0],
				gas: 6000000,
			})

		console.log(receipt.events.ProxyCreated.returnValues.proxy)
	} catch (e) {
		console.log(e)
	}

	callback()
}
