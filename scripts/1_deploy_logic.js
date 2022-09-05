const securityTokenJSON = require("../build/contracts/SecurityToken.json")
const { saveContractAddress } = require("./utils.js")

module.exports = async (callback) => {
	let newMicoboSecurityTokenLogic

	try {
		const accounts = await web3.eth.getAccounts()
		const chainId = await web3.eth.net.getId()

		let micoboSecurityToken = new web3.eth.Contract(securityTokenJSON.abi)

		newMicoboSecurityTokenLogic = await micoboSecurityToken
			.deploy({
				data: securityTokenJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 6000000,
				chainId: chainId,
			})

		// record contract address
		// this is needed for automatic contract verification to work (i.e. Etherscan)
		const relativePath = "/../build/contracts/SecurityToken.json"
		saveContractAddress(securityTokenJSON, chainId, newMicoboSecurityTokenLogic, relativePath)
	} catch (e) {
		console.error(e)
	}

	callback()
}
