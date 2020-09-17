const SecurityToken = artifacts.require("SecurityToken")
const SecurityTokenPartition = artifacts.require("SecurityTokenPartition")

const { conf } = require("../token-config")

const ERC1820 = require("erc1820")

module.exports = async (deployer, network, accounts) => {
	await ERC1820.deploy(web3, accounts[0])

	gnosisMultisigAddress = "0xCf58fD93bd6C6d2802e2Cdf33B37933dAEc024Ea"

	try {
		await deployer.deploy(
			SecurityToken,
			conf.name,
			conf.symbol,
			1,
			1000000,
			accounts[0],
			accounts[7],
			accounts[0],
			accounts[0],
			accounts[0]
		)

		let st = await SecurityToken.deployed()

		await deployer.deploy(SecurityTokenPartition, st.address, conf.standardPartition)
	} catch (e) {
		throw e
	}
}
