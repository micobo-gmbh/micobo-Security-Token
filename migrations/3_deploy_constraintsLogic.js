const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')


module.exports = async (deployer, network) => {

	await deployer.deploy(ConstraintsLogic)

};
