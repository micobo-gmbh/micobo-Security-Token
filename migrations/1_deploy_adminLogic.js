const AdministrationLogic = artifacts.require('AdministrationLogic')


module.exports = async (deployer, network) => {

	// Don't execute when only testing
	if (network === 'test') {
		return;
	}

	deployer.deploy(AdministrationLogic)

};