const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

const {deployAllContracts, Role, Code} = require('./deployment.js');


contract('Test Compliant Token', async (accounts) => {

	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts(accounts)

		// make me minter
		await contracts.micoboSecurityToken.addRole(Role.MINTER, accounts[0])


		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0'
		)

		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[1],
			value,
			'0x0'
		)
	})


	it("can send tokens from and to addresses", async () => {


		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[0]
			)).toNumber(),
			value - value
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[1]
			)).toNumber(),
			value + value
		)
	})

})
