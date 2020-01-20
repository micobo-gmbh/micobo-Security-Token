/*
	Test if all contracts can be deployed
 */

const MicoboSecurityToken = artifacts.require('SecurityToken')
SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

const conf = require('../token-config');


contract('Test Deployment', async (accounts) => {

	let micoboSecurityToken, securityTokenPartition

	// deepEqual compares with '==='

	it("deploys micobo security token", async () => {
		micoboSecurityToken = await MicoboSecurityToken.new(
			conf.name,
			conf.symbol,
			conf.granularity,
			[accounts[0]],
			[accounts[0]]
		)
	})

	it("adds the standard partition", async () => {

		// give CAP_EDITOR role
		await micoboSecurityToken.addRole(5, accounts[0])

		securityTokenPartition = await SecurityTokenPartition.new(
			micoboSecurityToken.address,
			conf.standardPartition
		)

		await micoboSecurityToken.addPartition(
			conf.standardPartition,
			securityTokenPartition.address,
			conf.standardPartitionCap
		)

		assert.deepEqual(
			await securityTokenPartition.securityTokenAddress(),
			micoboSecurityToken.address
		)

		assert.deepEqual(
			await securityTokenPartition.partitionId(),
			conf.standardPartition
		)


		assert.deepEqual(
			(await micoboSecurityToken.capByPartition(conf.standardPartition)).toNumber(),
			conf.standardPartitionCap
		)

		assert.deepEqual(
			await micoboSecurityToken.partitionProxies(),
			[securityTokenPartition.address]
		)
	})

})
