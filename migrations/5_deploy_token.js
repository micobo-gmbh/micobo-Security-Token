const CompliantToken = artifacts.require('CompliantToken')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const AdministrationMaster = artifacts.require('AdministrationMaster')

const config = require('../token-config')


module.exports = async (deployer, network) => {
	
	let c = await ConstraintsMaster.deployed()

	let a = await AdministrationMaster.deployed()

	await deployer.deploy(
		CompliantToken,
		config.name,
		config.symbol,
		config.decimals,
		config.cap,
		c.address,
		a.address
	)

};
