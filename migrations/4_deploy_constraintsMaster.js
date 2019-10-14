const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const AdministrationMaster = artifacts.require('AdministrationMaster')


module.exports = async (deployer, network) => {

	let c = await ConstraintsLogic.deployed()

	let a = await AdministrationMaster.deployed()

	await deployer.deploy(ConstraintsMaster, c.address, a.address)

};
