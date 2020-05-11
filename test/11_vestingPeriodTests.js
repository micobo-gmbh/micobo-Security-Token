const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { conf } = require('../token-config')
const { Role, Module } = require('./Constants')

const VestingPeriodConstraintModule = artifacts.require(
	'VestingPeriodConstraintModule'
)

contract('Test Vesting Period', async (accounts) => {
	let day = 86400

	let value = 1000

	let contracts

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

	it('deploy VestingPeriodConstraintModule', async () => {
		vestingPeriodConstraintModule = await VestingPeriodConstraintModule.new(
			contracts.micoboSecurityToken.address
		)
	})

	it('register VestingPeriodConstraintModule', async () => {
		// adding MODULE_EDITOR
		await contracts.micoboSecurityToken.addRole(Role.MODULE_EDITOR, accounts[0])

		// can set module
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(
				conf.standardPartition,
				[vestingPeriodConstraintModule.address]
			)
		)
	})

	it('can add vesting period when editor', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(
				Role.VESTING_PERIOD_EDITOR,
				accounts[0]
			),
			false
		)

		let now = new Date().getTime()
		now = (now / 1000).toFixed(0)

		vestingStart = now - -10

		/* 
        console.log(now)
        console.log(vestingStart)
		 */

		// cannot set vesting options
		await truffleAssert.fails(
			vestingPeriodConstraintModule.setVestingOptions(vestingStart, 4, 48)
		)

		// add role
		await contracts.micoboSecurityToken.addRole(
			Role.VESTING_PERIOD_EDITOR,
			accounts[0]
		)

		// now it can set vesting options
		await truffleAssert.passes(
			vestingPeriodConstraintModule.setVestingOptions(vestingStart, 4, 48)
		)
	})

	it('cannot transfer before dormant period is over', async () => {
		// assumes that a vesting period has been set in the test case before this one

		// cannot transfer
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				1,
				'0x0',
				{ from: accounts[0] }
			)
		)

		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		await sleep(11000)

		// can transfer again
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				1,
				'0x0',
				{ from: accounts[0] }
			)
		)
	})

	it('gets correct module name', async () => {
		assert.deepEqual(
			await vestingPeriodConstraintModule.getModuleName(),
			Module.VESTING
		)
	})
})
