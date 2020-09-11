const SecurityToken = artifacts.require("SecurityToken")

module.exports = async (deployer, network, accounts) => {
	try {
		let st = await SecurityToken.deployed()

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[0],
			100,
			"0x0"
		)

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[1],
			100,
			"0x0"
		)

		await st.issueByPartition(
			"0x0000000000000000000000000000000000000000000000000000000000000000",
			accounts[2],
			100,
			"0x0"
		)
	} catch (e) {
		throw e
	}
}
