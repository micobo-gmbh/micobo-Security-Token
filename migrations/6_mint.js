const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

module.exports = async (deployer, network, accounts) => {
	if (network == "development" || network == "soliditycoverage" || network == "test") {
		console.log("skipping minting migration")
		return
	}

	try {
		let st = await SecurityToken.deployed()

		/* await st.bulkIssueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			["0x38B2F7A67F892BaA8CA4a097E10Bb7Cee8Ca1555", "0x323148baF7f89F770D6eeD692c968ed513Fb9377"], // Nvisio test users
			[100, 100],
			"0x"
		) */

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[0],
			100,
			"0x"
		)

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[1],
			100,
			"0x"
		)

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[2],
			100,
			"0x"
		)
	} catch (e) {
		throw e
	}
}
