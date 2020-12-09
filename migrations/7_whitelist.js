const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

module.exports = async (deployer, network, accounts) => {
	if (network == "development" || network == "soliditycoverage" || network == "test") {
		console.log("skipping whitelist migration")
		return
	}

	try {
		let wl = await WhitelistConstraintModule.deployed()

		console.log(wl.address)

		await wl.bulkEditWhitelist([accounts[0], accounts[1], accounts[2]], true)
	} catch (e) {
		throw e
	}
}
