const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')


module.exports = async (deployer, network) => {

	// Don't execute when only testing
	if (network === 'test') {
		return;
	}

	await deployer.deploy(ConstraintsLogic)

};