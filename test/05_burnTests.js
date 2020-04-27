const { getDeployedContracts, Role } = require('./deployment.js')

const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

contract('Test Burning', async (accounts) => {
	let contracts

	let minter = accounts[1]
	let burner = accounts[2]

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = await getDeployedContracts(accounts)
	})

	it('burns tokens of test addresses if burner', async () => {
		// make minter
		await contracts.micoboSecurityToken.addRole(Role.ISSUER, minter)

		// mint
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0',
			{ from: minter }
		)

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value
		)

		// should fail because is not burner
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: burner }
			)
		)

		// make burner
		await contracts.micoboSecurityToken.addRole(Role.REDEEMER, burner)

		//should pass now
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: burner }
			)
		)

		// new balance matches
		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value - value
		)
	})

	it('cannot burn more than balance', async () => {
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0',
			{ from: minter }
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value / 2,
				'0x0',
				'0x0',
				{ from: burner }
			)
		)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: burner }
			)
		)

		// 1000000000000000
	})
})
