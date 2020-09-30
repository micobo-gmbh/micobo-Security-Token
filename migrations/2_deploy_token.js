const SecurityToken = artifacts.require("SecurityToken")
const SecurityTokenPartition = artifacts.require("SecurityTokenPartition")

const { conf } = require("../token-config")

const ERC1820 = require("erc1820")

module.exports = async (deployer, network, accounts) => {
	await ERC1820.deploy(web3, accounts[0])

	gnosisMultisigAddress = "0xCf58fD93bd6C6d2802e2Cdf33B37933dAEc024Ea"

	// use this for testing
	if (network == "development") {
		console.log("TEST MIGRATION")
		try {
			await deployer.deploy(
				SecurityToken,
				conf.name, // name
				conf.symbol, // symbol
				conf.granularity, // granularity of 2 for testing
				conf.standardCap, // cap
				accounts[0], // admin
				accounts[7], // controller is account 7, as to avoid confusion, because controller disregards constraints
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)

			let st = await SecurityToken.deployed()

			// TODO we might not need this anymore
			await deployer.deploy(SecurityTokenPartition, st.address, conf.standardPartition)
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

			// let st = await SecurityToken.deployed()

			// TODO we might not need this anymore
			// await deployer.deploy(SecurityTokenPartition, st.address, conf.standardPartition)
		} catch (e) {
			throw e
		}
	}
}
