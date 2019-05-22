const AdministrationLogic = artifacts.require('AdministrationLogic')


module.exports = async (deployer) => {

	deployer.deploy(AdministrationLogic)

};