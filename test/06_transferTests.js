const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { conf } = require('../token-config')
const { Role } = require('./Roles')

contract('Test Security Token', async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// add CAP_EDITOR role
		await contracts.micoboSecurityToken.addRole(Role.CAP_EDITOR, accounts[0])

		// set cap for new partition
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setCapByPartition(
				conf.standardPartition,
				conf.standardPartitionCap
			)
		)

		// make me minter
		await contracts.micoboSecurityToken.addRole(Role.ISSUER, accounts[0])

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

	it('can send tokens from and to addresses', async () => {
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
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value - value
		)

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[1]
				)
			).toNumber(),
			value - -value
		)
	})

	it('can send tokens using operator functionality', async () => {
		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				'0x0',
				'0x0'
			)
		)

		// authorize 0 from 1
		await contracts.micoboSecurityToken.authorizeOperatorByPartition(
			conf.standardPartition,
			accounts[0],
			{
				from: accounts[1],
			}
		)

		// now can transfer
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				'0x0',
				'0x0',
			)
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

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[1]
				)
			).toNumber(),
			value
		)

		// revoke 0 from 1
		await contracts.micoboSecurityToken.revokeOperatorByPartition(
			conf.standardPartition,
			accounts[0],
			{
				from: accounts[1],
			}
		)

		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				'0x0',
				'0x0'
			)
		)
	})

	it('can send tokens if controller', async () => {
		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				'0x0',
				'0x0'
			)
		)

		// make controller
		await contracts.micoboSecurityToken.addRole(Role.CONTROLLER, accounts[0])

		// can force transfer when controller
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				'0x0',
				'0x0'
			)
		)

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value - - value
		)

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[1]
				)
			).toNumber(),
			value - value
		)
	})
})
