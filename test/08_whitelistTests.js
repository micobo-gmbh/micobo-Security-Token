const WhitelistConstraintModule = artifacts.require('WhitelistConstraintModule')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const truffleAssert = require('truffle-assertions')

const { conf } = require('../token-config')
const { Role, Module } = require('./Constants')

contract('Test Whitelist', async (accounts) => {
	let contracts, whitelistConstraintModule

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

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

	it('deploy WhitelistConstraintModule', async () => {
		whitelistConstraintModule = await WhitelistConstraintModule.new(
			contracts.micoboSecurityToken.address
		)
	})

	it('register WhitelistConstraintModule', async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(
				conf.standardPartition,
				[whitelistConstraintModule.address]
			)
		)
	})

	it('cannot edit whitelist whithout being Whitelist_editor', async () => {
		await truffleAssert.fails(
			whitelistConstraintModule.editWhitelist(accounts[0], true)
		)

		await truffleAssert.fails(
			whitelistConstraintModule.bulkEditWhitelist(accounts, true)
		)
	})

	it('can edit whitelist when Whitelist_editor', async () => {
		// adding whitelist_editor
		contracts.micoboSecurityToken.addRole(Role.WHITELIST_EDITOR, accounts[0])

		await truffleAssert.passes(
			whitelistConstraintModule.editWhitelist(accounts[0], true)
		)

		assert.deepEqual(
			await whitelistConstraintModule.isWhitelisted(accounts[0]),
			true
		)

		await truffleAssert.passes(
			whitelistConstraintModule.bulkEditWhitelist(accounts, true)
		)

		assert.deepEqual(
			await whitelistConstraintModule.isWhitelisted(accounts[1]),
			true
		)

		await truffleAssert.passes(
			whitelistConstraintModule.bulkEditWhitelist(accounts, false)
		)

		assert.deepEqual(
			await whitelistConstraintModule.isWhitelisted(accounts[0]),
			false
		)

		assert.deepEqual(
			await whitelistConstraintModule.isWhitelisted(accounts[1]),
			false
		)
	})

	it('can transfer when whitelisted', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)
		
		await whitelistConstraintModule.editWhitelist(accounts[0], true)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)

		await whitelistConstraintModule.editWhitelist(accounts[1], true)

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
			await whitelistConstraintModule.getModuleName(),
			Module.WHITELIST
		)
	})
})
