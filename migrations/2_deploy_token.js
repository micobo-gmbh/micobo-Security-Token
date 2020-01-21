const SecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

const conf = require('../token-config')

const checkSize = require('../scripts/check-size')

module.exports = async (deployer, network) => {

	try {
		await deployer.deploy(
			SecurityToken,
			conf.name,
			conf.symbol,
			conf.granularity,
			conf.admins,
			conf.controllers
		)

		let st = await SecurityToken.deployed()

		await deployer.deploy(
			SecurityTokenPartition,
			st.address,
			conf.standardPartition
		)

	} catch (e) {
		console.log(e)
	}

	/* let max_reached = await checkSize(artifacts);

	if(max_reached) {
		console.log('\n CONTRACT TOO BIG!')
	} */

};





