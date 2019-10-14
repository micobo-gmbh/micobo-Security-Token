const AdministrationLogic = artifacts.require('AdministrationLogic')


module.exports = async (deployer, network) => {

	deployer.deploy(AdministrationLogic)

};
