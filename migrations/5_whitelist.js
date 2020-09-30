const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const SecurityToken = artifacts.require("SecurityToken")

module.exports = async (deployer, network, accounts) => {
	if (network == "development") {
		console.log("skipping whitelist migration")
		return
	}

	try {
		let wl = await WhitelistConstraintModule.deployed()
		let st = await SecurityToken.deployed()

		console.log(wl.address)

		// add whitelist editor
		await st.addRole("0x57484954454c4953545f454449544f5200000000000000000000000000000000", accounts[0])

		await wl.bulkEditWhitelist(
			["0x38B2F7A67F892BaA8CA4a097E10Bb7Cee8Ca1555", "0x323148baF7f89F770D6eeD692c968ed513Fb9377"],
			true
		)
	} catch (e) {
		throw e
	}
}
