const SecurityToken = artifacts.require("SecurityToken")

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

	/* await st.removeRole(
		"0x5350454e44494e475f4c494d4954535f454449544f5200000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
	)

	await st.removeRole(
		"0x56455354494e475f504552494f445f454449544f520000000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
	)

	await st.addRole(
		"0x5350454e44494e475f4c494d4954535f454449544f5200000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
	)

	await st.addRole(
		"0x56455354494e475f504552494f445f454449544f520000000000000000000000",
		"0x024269E2057b904d1Fa6a7B52056A8580a85180F"
	) */

	await st.addRole(
		"0x41444d494e000000000000000000000000000000000000000000000000000000",
		"0xCf58fD93bd6C6d2802e2Cdf33B37933dAEc024Ea"
	)

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
