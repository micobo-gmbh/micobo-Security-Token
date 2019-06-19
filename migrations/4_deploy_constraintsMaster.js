const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const AdministrationMaster = artifacts.require('AdministrationMaster')


module.exports = async (deployer, network) => {

	// Don't execute when only testing
	if (network === 'test') {
		return;
	}

	let c = await ConstraintsLogic.deployed()

	let a = await AdministrationMaster.deployed()

	await deployer.deploy(ConstraintsMaster, c.address, a.address)

};