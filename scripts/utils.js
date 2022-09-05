const fs = require("fs")

const saveContractAddress = (json, chainId, newContract, relativePath) => {
	if (!json.networks[chainId]) {
		console.log("New chainId. Creating new entry for", chainId)
		json.networks[chainId] = {}

		json.networks[chainId].address = newContract.options.address
	} else {
		console.log("Setting new address for chain: ", chainId)
		json.networks[chainId].address = newContract.options.address
	}
	console.log("Address: ", newContract.options.address)

	fs.writeFileSync(__dirname + relativePath, JSON.stringify(json, null, "  "))
	console.log("saving json complete")
	return null
}

module.exports = {
	saveContractAddress,
}
