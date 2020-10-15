const SecurityToken = artifacts.require("SecurityToken")
const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const TimeLockConstraintModule = artifacts.require("TimeLockConstraintModule")

module.exports = async (deployer, network, accounts) => {
	if (network == "development") {
		console.log("skipping setting modules")
		return
	}

	try {
		let st = await SecurityToken.deployed()

		let wl = await WhitelistConstraintModule.deployed()

		let tl = await TimeLockConstraintModule.deployed()

		await st.setModulesByPartition("0x0000000000000000000000000000000000000000000000000000000000000000", [
			wl.address,
			tl.address,
		])
	} catch (e) {
		throw e
	}
}
