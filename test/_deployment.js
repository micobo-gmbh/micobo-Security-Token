const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')
const AdministrationInterface = artifacts.require('AdministrationInterface')
const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')

const aos_conf = require('../AOS-config');



deployAllContracts = async () => {

	let constraintsLogic,
		constraintsProxy,
		constraintsInterface,
		compliantToken,
		compliantTokenInterface,
		adminLogic,
		adminProxy,
		adminInterface

	// ADMIN
	adminLogic = await AdministrationLogic.new()

	adminProxy = await AdministrationMaster.new(adminLogic.address)

	adminInterface = await AdministrationInterface.at(adminProxy.address)


	// CONSTRAINTS
	constraintsLogic = await ConstraintsLogic.new(adminProxy.address)

	constraintsProxy = await ConstraintsMaster.new(constraintsLogic.address, adminProxy.address)

	constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)


	// TOKEN
	compliantToken = await CompliantToken.new(
		aos_conf.name,
		aos_conf.symbol,
		aos_conf.decimals,
		aos_conf.cap,
		constraintsProxy.address,
		adminProxy.address)

	compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

	return {
		constraintsLogic,
		constraintsProxy,
		constraintsInterface,
		compliantToken,
		compliantTokenInterface,
		adminLogic,
		adminProxy,
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