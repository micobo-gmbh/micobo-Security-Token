const TimeLockConstraintModule = artifacts.require('TimeLockConstraintModule')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const truffleAssert = require('truffle-assertions')

const { conf } = require('../token-config')
const { Role, Module } = require('./Constants')

contract('Test TimeLock Module', async (accounts) => {
	let contracts, timeLockConstraintModule

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

	it('deploy TimeLockConstraintModule', async () => {
		timeLockConstraintModule = await TimeLockConstraintModule.new(
			contracts.micoboSecurityToken.address
		)
	})

	it('register TimeLockConstraintModule', async () => {
		// adding MODULE_EDITOR
		await contracts.micoboSecurityToken.addRole(Role.MODULE_EDITOR, accounts[0])

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(
				conf.standardPartition,
				[timeLockConstraintModule.address]
			)
		)
	})

	it('can edit timelock when time_lock_editor', async () => {
		await truffleAssert.fails(
			timeLockConstraintModule.editTimeLock(conf.standardPartition, 1893456000) // 01/01/2030 @ 12:00 (UTC)
		)

		await contracts.micoboSecurityToken.addRole(
			Role.TIME_LOCK_EDITOR,
			accounts[0]
		)

		await truffleAssert.passes(
			timeLockConstraintModule.editTimeLock(conf.standardPartition, 1893456000) // 01/01/2030 @ 12:00 (UTC)
		)
	})

	it('cannot transfer when timelocked', async () => {
		timeLockConstraintModule.editTimeLock(conf.standardPartition, 1893456000) // 01/01/2030 @ 12:00 (UTC)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)
	})

	it('can transfer when timelock over', async () => {
		await timeLockConstraintModule.editTimeLock(
			conf.standardPartition,
			1577836800
		) // 01/01/2020 @ 12:00 (UTC)

		// check if balance is enough
		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)
	})

	it('gets correct module name', async () => {
		assert.deepEqual(
			await timeLockConstraintModule.getModuleName(),
			Module.TIME_LOCK
		)
	})
})
