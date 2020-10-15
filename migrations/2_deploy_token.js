const SecurityToken = artifacts.require("SecurityToken")

const { conf } = require("../token-config")

const ERC1820 = require("erc1820")

module.exports = async (deployer, network, accounts) => {
	await ERC1820.deploy(web3, accounts[0])

	gnosisMultisigAddress = "0xCf58fD93bd6C6d2802e2Cdf33B37933dAEc024Ea"

	// use this for testing
	if (network == "development") {
		console.log("DEV MIGRATION")
		try {
			await deployer.deploy(
				SecurityToken,
				conf.name, // name
				conf.symbol, // symbol
				conf.granularity, // granularity of 2 for testing
				conf.standardCap, // cap
				accounts[0], // admin
				accounts[7], // controller is account 7 to avoid confusion, because controller disregards constraints
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)
		} catch (e) {
			throw e
		}
	} else if (network == "test") {
		console.log("TEST MIGRATION")
		try {
			await deployer.deploy(
				SecurityToken,
				conf.name, // name
				conf.symbol, // symbol
				1, // granularity
				conf.standardCap, // cap
				accounts[0], // admin
				accounts[0], // controller is account 7 to avoid confusion, because controller disregards constraints
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)
		} catch (e) {
			throw e
		}

		// this for everything else
	} else {
		try {
			await deployer.deploy(
				SecurityToken,
				conf.name, // name
				conf.symbol, // symbol
				1, // granularity
				1000000, // cap
				gnosisMultisigAddress, // admin
				gnosisMultisigAddress, // controller
				gnosisMultisigAddress, // issuer
				gnosisMultisigAddress, // redeemer
				gnosisMultisigAddress // module_editor
			)
		} catch (e) {
			throw e
		}
	}
}
