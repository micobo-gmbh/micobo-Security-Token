const fs = require("fs")

const saveContractAddress = (json, networkId, newContract, relativePath) => {
	if (!json.networks[networkId]) {
		console.log("New networkId. Creating new entry for", networkId)
		json.networks[networkId] = {}

		json.networks[networkId].address = newContract.options.address
	} else {
		console.log("Setting new address for network: ", networkId)
		json.networks[networkId].address = newContract.options.address
	}
	console.log("Address: ", newContract.options.address)

	fs.writeFileSync(__dirname + relativePath, JSON.stringify(json, null, "  "))
	console.log("saving json complete")
	return null
}

module.exports = {
	saveContractAddress,
}
