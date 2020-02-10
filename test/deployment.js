const MicoboSecurityToken = artifacts.require('SecurityToken')
SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

ISecurityTokenPartition = artifacts.require('ISecurityTokenPartition')

const conf = require('../token-config');


deployAllContracts = async (accounts) => {

	let micoboSecurityToken, securityTokenPartition

	micoboSecurityToken = await MicoboSecurityToken.new(
		conf.name,
		conf.symbol,
		conf.granularity,
		[accounts[0]],
		[accounts[0]]
	)

	securityTokenPartition = await SecurityTokenPartition.new(
		micoboSecurityToken.address,
		conf.standardPartition
	)

	await micoboSecurityToken.addPartition(
		conf.standardPartition, 
		securityTokenPartition.address,
		conf.standardPartitionCap
	)

	return {
		micoboSecurityToken,
		securityTokenPartition
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
	SPENDING_LIMITS_EDITOR: 10
}

module.exports = {
	deployAllContracts,
	Role
}
