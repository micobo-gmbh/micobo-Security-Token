const MicoboSecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

ISecurityTokenPartition = artifacts.require('ISecurityTokenPartition')

const conf = require('../token-config')

getDeployedContracts = async () => {

	return {
		micoboSecurityToken : await MicoboSecurityToken.deployed(),
		securityTokenPartition : await SecurityTokenPartition.deployed(),
	}
}

const Role = {
	ADMIN: 0,
	CONTROLLER: 1,
	MINTER: 2,
	PAUSER: 3,
	BURNER: 4,
	CAP_EDITOR: 5,
	MODULE_EDITOR: 6,
	DOCUMENT_EDITOR: 7,
	WHITELIST_EDITOR: 8,
	TIME_LOCK_EDITOR: 9,
	SPENDING_LIMITS_EDITOR: 10,
	VESTING_PERIOD_EDITOR: 11,
}

module.exports = {
	getDeployedContracts,
	Role,
}
