const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { conf } = require('../token-config')
const { Role, Module } = require('./Constants')

const SpendingLimitsConstraintModule = artifacts.require(
	'SpendingLimitsConstraintModule'
)

contract('Test Spending Limits', async (accounts) => {
	let day = 86400

	let value = 1000

	let contracts

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

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

	it('deploy SpendingLimitsConstraintModule', async () => {
		spendingLimitsConstraintModule = await SpendingLimitsConstraintModule.new(
			contracts.micoboSecurityToken.address
		)
	})

	it('register SpendingLimitsConstraintModule', async () => {
		// adding MODULE_EDITOR
		await contracts.micoboSecurityToken.addRole(Role.MODULE_EDITOR, accounts[0])

		// can set module
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(
				conf.standardPartition,
				[spendingLimitsConstraintModule.address]
			)
		)
	})

	it('can add spending limit when editor', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(
				Role.SPENDING_LIMITS_EDITOR,
				accounts[0]
			),
			false
		)

		// cannot add timelock yet
		await truffleAssert.fails(
			spendingLimitsConstraintModule.addTimelock(day, 100)
		)

		// add role
		await contracts.micoboSecurityToken.addRole(
			Role.SPENDING_LIMITS_EDITOR,
			accounts[0]
		)

		// now it can add timelock
		await truffleAssert.passes(
			spendingLimitsConstraintModule.addTimelock(day, 100)
		)

		// and another one
		await truffleAssert.passes(
			spendingLimitsConstraintModule.addTimelock(day * 2, 200)
		)
	})

	it('can set spending limit when editor', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(
				Role.SPENDING_LIMITS_EDITOR,
				accounts[0]
			),
			true
		)

		// cannot update if not editor
		await truffleAssert.fails(
			spendingLimitsConstraintModule.setTimelock(1, day * 7, 700, {
				from: accounts[1],
			})
		)

		// can update the 2nd timelock
		await truffleAssert.passes(
			spendingLimitsConstraintModule.setTimelock(1, day * 7, 700)
		)

		// cannot update non-existing 3rd timelock entry
		await truffleAssert.fails(
			spendingLimitsConstraintModule.setTimelock(2, day * 7, 700)
		)
	})

	it('can delete spending limit when editor', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(
				Role.SPENDING_LIMITS_EDITOR,
				accounts[0]
			),
			true
		)

		// cannot delete if not editor
		await truffleAssert.fails(
			spendingLimitsConstraintModule.deleteTimelock(0, {
				from: accounts[1],
			})
		)

		// can delete 1st timelock entry
		await truffleAssert.passes(spendingLimitsConstraintModule.deleteTimelock(0))

		// cannot delete 2nd timelock entry, since only 1 is left
		await truffleAssert.fails(spendingLimitsConstraintModule.deleteTimelock(1))

		// can delete 1st timelock entry
		await truffleAssert.passes(spendingLimitsConstraintModule.deleteTimelock(0))
	})

	it('can transfer according to limits', async () => {
		// add new timelock of 10 seconds and 100
		await truffleAssert.passes(
			spendingLimitsConstraintModule.addTimelock(10, 100)
		)

		// cannot transfer 110
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				110,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// can transfer 80
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				80,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// can transfer another 10
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				10,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// cannot transfer 80 again
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				80,
				'0x0',
				{ from: accounts[0] }
			)
		)

		await sleep(11000)

		// can transfer 80 again
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				80,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// delete 1st timelock entry
		await spendingLimitsConstraintModule.deleteTimelock(0)
	})

	it('can CANtransfer according to limits', async () => {
		await sleep(11000)

		// add new timelock of 10 seconds and 100
		await truffleAssert.passes(
			spendingLimitsConstraintModule.addTimelock(10, 100)
		)

		// cannot transfer 110
		let res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			110,
			'0x0',
			{ from: accounts[0] }
		)
		// console.log(res)
		assert.deepEqual(res['0'], '0xa8')

		// can transfer 80
		res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			80,
			'0x0',
			{ from: accounts[0] }
		)
		assert.deepEqual(res['0'], '0xa2')

		//actually do transfer
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				80,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// can transfer another 10
		res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			10,
			'0x0',
			{ from: accounts[0] }
		)
		assert.deepEqual(res['0'], '0xa2')

		//actually do transfer
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				10,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// cannot transfer 80 again
		res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			80,
			'0x0',
			{ from: accounts[0] }
		)
		assert.deepEqual(res['0'], '0xa8')

		await sleep(11000)

		//do transfer to update blocktime
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				10,
				'0x0',
				{ from: accounts[0] }
			)
		)

		// can transfer 80 again
		res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			80,
			'0x0',
			{ from: accounts[0] }
		)
		assert.deepEqual(res['0'], '0xa2')
	})

	it('gets correct module name', async () => {
		assert.deepEqual(
			await spendingLimitsConstraintModule.getModuleName(),
			Module.SPENDING_LIMIT
		)
	})
})
