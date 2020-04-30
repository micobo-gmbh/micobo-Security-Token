const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { Role } = require('./Roles')
const { conf } = require('../token-config')

contract('Test Minting and Cap', async (accounts) => {
	let contracts

	let minter = accounts[1]

	let value = 1234567890

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
	})

	it('mints tokens to test addresses if minter', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0'
			)
		)

		await contracts.micoboSecurityToken.addRole(Role.ISSUER, accounts[0])

		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0'
		)

		let balance = (
			await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[0]
			)
		).toNumber()

		// console.log("balance: ", balance);

		assert.deepEqual(balance, value)
	})

	it('cannot mint more than cap', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(
				conf.standardPartition,
				accounts[0],
				conf.standardPartitionCap + 1,
				'0x0'
			)
		)
	})

	it('can mint in bulk', async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				[accounts[0], accounts[1], accounts[2]],
				[10, 20, 30],
				'0x0'
			)
		)

		let balance1 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[0]
			)
		).toNumber()

		assert.deepEqual(balance1, value - -10)

		let balance2 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[1]
			)
		).toNumber()

		assert.deepEqual(balance2, 20)

		let balance3 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[2]
			)
		).toNumber()

		assert.deepEqual(balance3, 30)
	})

	it('can mint multiple times in bulk', async () => {
		var tokenHolders = []
		var values = []

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 10; j++) {
				tokenHolders.push(accounts[j])
				values.push(10)
			}
		}

		await truffleAssert.passes(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				tokenHolders,
				values,
				'0x0'
			)
		)
	})

	it('cannot submit different array lengths', async () => {
		var tokenHolders = []
		var values = []

		tokenHolders.push(accounts[0])
		values.push(10)
		values.push(10)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				tokenHolders,
				values,
				'0x0'
			),
			'revert',
			'must be same length'
		)
	})

	it('cannot exceed cap', async () => {
		// should be just too much for the partition
		var capFraction = (conf.standardPartitionCap / 39).toFixed(0)

		var tokenHolders = []
		var values = []

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 10; j++) {
				tokenHolders.push(accounts[j])
				values.push(capFraction)
			}
		}

		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				tokenHolders,
				values,
				'0x0'
			),
			'revert',
			'would exceed capByPartition'
		)
	})
})
