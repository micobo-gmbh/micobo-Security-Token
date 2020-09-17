const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const SecurityToken = artifacts.require("SecurityToken")

module.exports = async (deployer, network, accounts) => {
	try {
		let wl = await WhitelistConstraintModule.deployed()
		let st = await SecurityToken.deployed()

		// add whitelist editor
		await st.addRole("0x57484954454c4953545f454449544f5200000000000000000000000000000000", accounts[0])

		await wl.bulkEditWhitelist([accounts[0], accounts[1], accounts[2]], true)
	} catch (e) {
		throw e
	}
}
