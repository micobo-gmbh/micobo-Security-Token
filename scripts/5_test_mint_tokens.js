const securityTokenJSON = require("../build/contracts/SecurityToken.json")

module.exports = async (callback) => {
	try {
		const accounts = await web3.eth.getAccounts()

		let micoboSecurityToken = new web3.eth.Contract(securityTokenJSON.abi)
		micoboSecurityToken.options.address = "INSERT_ADDRESS"

		await micoboSecurityToken.methods
			.issueByPartition(
				"0x0000000000000000000000000000000000000000000000000000000000000000",
				accounts[0],
				100,
				"0x"
			)
			.send({
				from: accounts[0],
                gas: 1000000,
                // gasPrice: 39000000000  turn on and set to current gas price for mainnet
			})
	} catch (e) {
		console.log(e)
	}

	callback()
}
