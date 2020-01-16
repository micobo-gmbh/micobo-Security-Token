const Admin = artifacts.require('Admin')
const MicoboSecurityToken = artifacts.require('SecurityToken')
ISecurityTokenPartition = artifacts.require('ISecurityTokenPartition')

const conf = require('../token-config');


deployAllContracts = async (accounts) => {

	let micoboSecurityToken, adminInterface

	adminInterface = await Admin.new(
		[accounts[0]],
		[accounts[0]]
	)

	micoboSecurityToken = await MicoboSecurityToken.new(
		conf.name,
		conf.symbol,
		conf.granularity,
		adminInterface.address
	)

	await adminInterface.addRole(5, accounts[0]) // CAP_EDITOR
	await micoboSecurityToken.addPartition(conf.standardPartition, conf.standardPartitionCap)
	let partitionProxies = await micoboSecurityToken.partitionProxies()
	let securityTokenPartition = await ISecurityTokenPartition.at(partitionProxies[0])

	return {
		micoboSecurityToken,
		adminInterface,
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
	CONSTRAINTS_EDITOR: 6,
	DOCUMENT_EDITOR: 7
}

module.exports = {
	deployAllContracts,
	Role
}
