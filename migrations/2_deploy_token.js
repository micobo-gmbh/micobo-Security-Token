const SecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

const {conf} = require('../token-config')

const checkSize = require('../scripts/check-size')

module.exports = async (deployer, network, accounts) => {
	try {
		await deployer.deploy(
			SecurityToken,
			conf.name,
			conf.symbol,
			conf.granularity,
			[accounts[0]]
		)

		let st = await SecurityToken.deployed()

		await deployer.deploy(
			SecurityTokenPartition,
			st.address,
			conf.standardPartition
		)
	} catch (e) {
		throw e
	}
}
