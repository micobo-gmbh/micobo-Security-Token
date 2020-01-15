const Admin = artifacts.require('Admin')
const SecurityToken = artifacts.require('SecurityToken')

const conf = require('../token-config')

const checkSize = require('../scripts/check-size')

module.exports = async (deployer, network) => {

	try {
		await deployer.deploy(
			Admin,
			conf.admins,
			conf.controllers
		)

		let admin = await Admin.deployed()

		await deployer.deploy(
			SecurityToken,
			conf.name,
			conf.symbol,
			conf.granularity,
			admin.address
		)
	} catch (e) {
		console.log(e)
	}

	let max_reached = await checkSize(artifacts);

	if(max_reached) {
		console.log('\n CONTRACT TOO BIG!')
	}

};





