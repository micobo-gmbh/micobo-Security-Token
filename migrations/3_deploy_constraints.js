const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const TimeLockConstraintModule = artifacts.require("TimeLockConstraintModule")
const SpendingLimitsConstraintModule = artifacts.require("SpendingLimitsConstraintModule")
const VestingPeriodConstraintModule = artifacts.require("VestingPeriodConstraintModule")

module.exports = async (deployer, network, accounts) => {
	if (network == "development") {
		console.log("skipping constraint migration")
		return
	}

	try {
		let st = await SecurityToken.deployed()

		await deployer.deploy(WhitelistConstraintModule, st.address)

		await deployer.deploy(TimeLockConstraintModule, st.address)

		// let sl = await deployer.deploy(SpendingLimitsConstraintModule, st.address)

		// let vp = await deployer.deploy(VestingPeriodConstraintModule, st.address)

		// TODO off-chain validation
	} catch (e) {
		throw e
	}
}
