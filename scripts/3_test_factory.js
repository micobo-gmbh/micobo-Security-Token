const securityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")
const { saveContractAddress } = require("./utils.js")

module.exports = async (callback) => {
	try {
		securityTokenFactory = new web3.eth.Contract(
			securityTokenFactoryJSON.abi,
			"0xaBBb6A4889CCDdb7FD8b461AC1157349c8067870"
		)

		let result = await securityTokenFactory.methods.implementationContract().call()
		console.log("logic:", result)
		console.log("Should be: ", "0xc1aAB2dc3Fe5082D2D3eAaf67f4D49619B9862C9")

		const chainId = await web3.eth.net.getId()

		const newSecurityTokenFactory = {
			options: {
				address: "0xaBBb6A4889CCDdb7FD8b461AC1157349c8067870",
			},
		}

		// record contract address
		const relativePath = "/../build/contracts/SecurityTokenFactory.json"
		saveContractAddress(securityTokenFactoryJSON, chainId, newSecurityTokenFactory, relativePath)
	} catch (e) {
		console.log(e)
	}

	callback()
}
