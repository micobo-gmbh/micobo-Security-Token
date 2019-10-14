const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')


module.exports = async (deployer, network, accounts) => {

	let a = await AdministrationLogic.deployed()

	await deployer.deploy(AdministrationMaster, a.address, accounts[0])

};
