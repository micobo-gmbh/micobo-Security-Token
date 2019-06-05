const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')
const AdministrationInterface = artifacts.require('AdministrationInterface')
const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')

const token_conf = require('../token-config');



deployAllContracts = async () => {

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

	adminMaster = await AdministrationMaster.new(adminLogic.address)

	adminInterface = await AdministrationInterface.at(adminMaster.address)


	// CONSTRAINTS
	constraintsLogic = await ConstraintsLogic.new(adminMaster.address)

	constraintsMaster = await ConstraintsMaster.new(constraintsLogic.address, adminMaster.address)

	constraintsInterface = await ConstraintsInterface.at(constraintsMaster.address)


	// TOKEN
	compliantToken = await CompliantToken.new(
		token_conf.name,
		token_conf.symbol,
		token_conf.decimals,
		token_conf.cap,
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
	SOME_NEW_ROLE: 6
}

module.exports = {
	deployAllContracts,
	Role,
	Code
}