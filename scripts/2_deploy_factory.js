const securityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")
const { saveContractAddress } = require("./utils.js")

module.exports = async (callback) => {
	try {
		const chainId = await web3.eth.net.getId()

		// get the address of the security token implementation/logic on the current chain
		securityTokenLogicAddress = securityTokenJSON.networks[chainId].address

		console.log("using implementation at: ", securityTokenLogicAddress)

		const accounts = await web3.eth.getAccounts()

		securityTokenFactory = new web3.eth.Contract(securityTokenFactoryJSON.abi)

		const newSecurityTokenFactory = await securityTokenFactory
			.deploy({
				data: securityTokenFactoryJSON.bytecode,
				//
				arguments: [securityTokenLogicAddress],
			})
			.send({
				from: accounts[0],
				gas: 2000000,
				chainId: chainId,
			})

		console.log("Address: ", newSecurityTokenFactory.options.address)

		// record contract address
		const relativePath = "/../build/contracts/SecurityTokenFactory.json"
		saveContractAddress(securityTokenFactoryJSON, chainId, newSecurityTokenFactory, relativePath)
	} catch (e) {
		console.error(e)
	}

	callback()
}
