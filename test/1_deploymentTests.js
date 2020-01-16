/*
	Test if all contracts can be deployed
 */

const Admin = artifacts.require('Admin')
const MicoboSecurityToken = artifacts.require('SecurityToken')
ISecurityTokenPartition = artifacts.require('ISecurityTokenPartition')

const conf = require('../token-config');


contract('Test Deployment', async (accounts) => {

	let micoboSecurityToken, admin, securityTokenPartition

	// deepEqual compares with '==='

	it("deploys admin contract", async () => {
		admin = await Admin.new(
			[accounts[0]],
			[accounts[0]]
		)
	})

	it("deploys micobo security token", async () => {
		micoboSecurityToken = await MicoboSecurityToken.new(
			conf.name,
			conf.symbol,
			conf.granularity,
			admin.address
		)

		// console.log(micoboSecurityToken);
	})

	it("adds the standard partition", async() => {

		// give CAP_EDITOR role
		await admin.addRole(5, accounts[0])

		await micoboSecurityToken.addPartition(conf.standardPartition, conf.standardPartitionCap)

		// console.log('securityTokenAddress', micoboSecurityToken.address)

		let partitionProxies = await micoboSecurityToken.partitionProxies()

		// console.log('partition proxy', partitionProxies[0])

		let securityTokenPartition = await ISecurityTokenPartition.at(partitionProxies[0])

		assert.deepEqual(
			await securityTokenPartition.securityTokenAddress(),
			micoboSecurityToken.address
		)

		assert.deepEqual(
			await securityTokenPartition.partitionId(),
			conf.standardPartition
		)
	})

})
