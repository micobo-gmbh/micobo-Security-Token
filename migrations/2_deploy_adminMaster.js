const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')


module.exports = async (deployer) => {

	let a = await AdministrationLogic.deployed()

	console.log(a)

	deployer.deploy(AdministrationMaster, a.address)

};