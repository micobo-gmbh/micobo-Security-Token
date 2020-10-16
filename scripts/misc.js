const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const TimeLockConstraintModule = artifacts.require("TimeLockConstraintModule")

module.exports = async () => {
	/* let receipt = await web3.eth.getTransactionReceipt(
		"0xc162a856d49e713c05137f0f3c7cdca7c8171061547536fe73a7de19e00e5187"
	)
	console.log(receipt) */

	/* let objects = await web3.eth.getPendingTransactions().catch((e) => {
        console.log(e)
    })
	console.log(objects)
	for (const o in objects) {
		console.log(o)
		if (o.hash == "0xc162a856d49e713c05137f0f3c7cdca7c8171061547536fe73a7de19e00e5187") {
			console.log(o)
		}
	} */

	let st = await SecurityToken.deployed()
	console.log(st.address)

	/* let has = await st.hasRole(
		"0x52454445454d4552000000000000000000000000000000000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
	)
	console.log(has) */

	// let account = "0x024269E2057b904d1Fa6a7B52056A8580a85180F"

	try {
		// WHITELIST_EDITOR
		/* await st.addRole(
			"0x57484954454c4953545f454449544f5200000000000000000000000000000000",
			"0x548679A19c03E437429389dbe1d5e9B6a469988B"
		) */
		// PAUSER
		/* await st.addRole(
			"0x5041555345520000000000000000000000000000000000000000000000000000",
			"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
		) */
		//await st.unpause()
		// CAP_EDITOR
		/* await st.addRole(
			"0x4341505f454449544f5200000000000000000000000000000000000000000000",
			"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
		) */
		// await st.setCap(2000000)
		/* await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			"0x024269E2057b904d1Fa6a7B52056A8580a85180F",
			3,
			"0x0"
		) */
		/* await st.redeemByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			1,
			"0x0"
		) */
		/* await st.removeRole(
		"0x5350454e44494e475f4c494d4954535f454449544f5200000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
		)

		await st.removeRole(
			"0x56455354494e475f504552494f445f454449544f520000000000000000000000",
			"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
		)

		await st.addRole(
			"0x57484954454c4953545f454449544f5200000000000000000000000000000000",
			"0x548679A19c03E437429389dbe1d5e9B6a469988B"
		)

		await st.addRole(
			"0x52454445454d4552000000000000000000000000000000000000000000000000",
			"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
		) */
	} catch (e) {
		console.error(e)
	}

	/* let wl = await WhitelistConstraintModule.deployed()

	let tl = await TimeLockConstraintModule.deployed() */

	// let sl = await deployer.deploy(SpendingLimitsConstraintModule, st.address)

	// let vp = await deployer.deploy(VestingPeriodConstraintModule, st.address)

	// TODO off-chain validation

	/* try {
		await st.setModulesByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			[wl.address, tl.address]
		)
	} catch (e) {
		console.log(e)
	} */
}
