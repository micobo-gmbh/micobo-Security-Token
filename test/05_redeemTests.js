const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { conf } = require('../token-config')
const { Role } = require('./Constants')

contract('Test Redeeming', async (accounts) => {
	let contracts

	let issuer = accounts[1]
	let redeemer = accounts[2]

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		await contracts.micoboSecurityToken.addRole(Role.ISSUER, issuer)

		// mint
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0',
			{ from: issuer }
		)

		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[3],
			value,
			'0x0',
			{ from: issuer }
		)
	})

	it('can redeem tokens of other address if redeemer and controller', async () => {

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			value
		)

		// should fail because is neither redeemer nor controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: redeemer }
			)
		)

		// make redeemer
		await contracts.micoboSecurityToken.addRole(Role.REDEEMER, redeemer)

		// should fail because is not controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: redeemer }
			)
		)

		// make controller
		await contracts.micoboSecurityToken.addRole(Role.CONTROLLER, redeemer)

		// remove redeemer
		await contracts.micoboSecurityToken.removeRole(Role.REDEEMER, redeemer)

		// should fail because is not redeemer
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: redeemer }
			)
		)

		// make redeemer
		await contracts.micoboSecurityToken.addRole(Role.REDEEMER, redeemer)

		//should pass now
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: redeemer }
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

	it('can redeem own tokens only if redeemer', async () => {
		// should fail because is not redeemer
		await truffleAssert.fails(
			contracts.micoboSecurityToken.redeemByPartition(
				conf.standardPartition,
				value,
				'0x0',
				{ from: accounts[3] }
			)
		)

		// make redeemer
		await contracts.micoboSecurityToken.addRole(Role.REDEEMER, accounts[3])

		//should pass now
		await truffleAssert.passes(
			contracts.micoboSecurityToken.redeemByPartition(
				conf.standardPartition,
				value,
				'0x0',
				{ from: accounts[3] }
			)
		)

		// new balance matches
		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[3]
				)
			).toNumber(),
			value - value
		)
	})

	it('cannot redeem more than balance', async () => {
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0',
			{ from: issuer }
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value / 2,
				'0x0',
				'0x0',
				{ from: redeemer }
			)
		)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorRedeemByPartition(
				conf.standardPartition,
				accounts[0],
				value,
				'0x0',
				'0x0',
				{ from: redeemer }
			)
		)

		// 1000000000000000
	})
})
