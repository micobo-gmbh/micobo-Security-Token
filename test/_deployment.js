const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')
const AdministrationInterface = artifacts.require('AdministrationInterface')
const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')

const aos_conf = require('../token-config');



deployAllContracts = async (admin) => {

	let constraintsLogic,
		constraintsMaster,
		constraintsInterface,
		compliantToken,
		compliantTokenInterface,
		adminLogic,
		adminMaster,
		adminInterface

	// ADMIN
	adminLogic = await AdministrationLogic.new()

	adminMaster = await AdministrationMaster.new(adminLogic.address, admin)

	adminInterface = await AdministrationInterface.at(adminMaster.address)


	// CONSTRAINTS
	constraintsLogic = await ConstraintsLogic.new(adminMaster.address)

	constraintsMaster = await ConstraintsMaster.new(constraintsLogic.address, adminMaster.address)

	constraintsInterface = await ConstraintsInterface.at(constraintsMaster.address)


	// TOKEN
	compliantToken = await CompliantToken.new(
		aos_conf.name,
		aos_conf.symbol,
		aos_conf.decimals,
		aos_conf.cap,
		constraintsMaster.address,
		adminMaster.address)

	compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

	return {
		constraintsLogic,
		constraintsMaster,
		constraintsInterface,
		compliantToken,
		compliantTokenInterface,
		adminLogic,
		adminMaster,
		adminInterface
	}
}

const Code = {
	SEND: 0,
	RECEIVE: 1,
	SOME_NEW_CODE: 2
}

const Role = {
	ADMIN: 0,
	ADMIN_UPDATER: 1,
	CONSTRAINTS_UPDATER: 2,
	MINTER: 3,
	PAUSER: 4,
	CONSTRAINTS_EDITOR: 5,
	BURNER: 6,
	SOME_NEW_ROLE: 7
}

module.exports = {
	deployAllContracts,
	Role,
	Code
}