const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

const SpendingLimitsConstraintModule = artifacts.require(
	'SpendingLimitsConstraintModule'
)

const { getDeployedContracts, Role, Code } = require('./deployment.js')

contract('Test Spending Limits', async (accounts) => {

	let day = 86400

	let value = 1000

	let contracts

	// deepEqual compares with '==='

	before(async () => {
		contracts = await getDeployedContracts(accounts)

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
			contracts.micoboSecurityToken.setModules([
				spendingLimitsConstraintModule.address,
			])
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

		// cannot transfer 80 again
		// TODO find a solution for record keeping (altering the state during validation)
		/* await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				80,
				'0x0',
				{ from: accounts[0] }
			)
		) */

		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

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
	})
})
