const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')


module.exports = async (deployer, network) => {

	// Don't execute when only testing
	if (network === 'development') {
		return;
	}

	let a = await AdministrationLogic.deployed()

	console.log(a)

	deployer.deploy(AdministrationMaster, a.address)

};