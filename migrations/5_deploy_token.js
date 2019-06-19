const CompliantToken = artifacts.require('CompliantToken')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const AdministrationMaster = artifacts.require('AdministrationMaster')

const config = require('../token-config')


module.exports = async (deployer, network) => {

	// Don't execute when only testing
	if (network === 'test') {
		return;
	}
	
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