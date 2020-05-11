const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

const { conf } = require('../token-config')
const { Role } = require('./Constants')

contract('Test Token Partition ERC20 Proxy', async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		;(contracts['securityTokenPartition'] = await SecurityTokenPartition.new(
			contracts.micoboSecurityToken.address,
			conf.standardPartition
		)),
			// add CAP_EDITOR role
			await contracts.micoboSecurityToken.addRole(Role.CAP_EDITOR, accounts[0])

		// set cap for new partition
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setCapByPartition(
				conf.standardPartition,
				conf.standardPartitionCap
			)
		)

		// add partition
		await contracts.micoboSecurityToken.addPartitionProxy(
			conf.standardPartition,
			contracts.securityTokenPartition.address
		)

		// remove CAP_EDITOR role
		await contracts.micoboSecurityToken.removeRole(Role.CAP_EDITOR, accounts[0])

		// mint some tokens

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

	it('partition gives me all the correct token information', async () => {
		assert.deepEqual(
			await contracts.securityTokenPartition.securityTokenAddress(),
			contracts.micoboSecurityToken.address
		)

		assert.deepEqual(
			await contracts.securityTokenPartition.partitionId(),
			conf.standardPartition
		)

		assert.deepEqual(
			(await contracts.securityTokenPartition.cap()).toNumber(),
			conf.standardPartitionCap
		)

		assert.deepEqual(await contracts.securityTokenPartition.name(), conf.name)

		assert.deepEqual(
			await contracts.securityTokenPartition.symbol(),
			conf.symbol
		)

		assert.deepEqual(
			(await contracts.securityTokenPartition.decimals()).toNumber(),
			18
		)

		assert.deepEqual(
			(await contracts.securityTokenPartition.totalSupply()).toNumber(),
			value * 2
		)
	})

	it('can transfer using proxy', async () => {
		await truffleAssert.passes(
			contracts.securityTokenPartition.transfer(accounts[1], value, {
				from: accounts[0],
			})
		)

		let balance = (
			await contracts.securityTokenPartition.balanceOf(accounts[1])
		).toNumber()

		// console.log(balance)

		assert.deepEqual(balance, value * 2)
	})

	it('can approve and transferFrom using proxy', async () => {
		// fails without approval
		await truffleAssert.fails(
			contracts.securityTokenPartition.transferFrom(
				accounts[1],
				accounts[0],
				value,
				{ from: accounts[0] }
			)
		)

		// 1 approves 0 to transfer value
		await truffleAssert.passes(
			contracts.securityTokenPartition.approve(accounts[0], value, {
				from: accounts[1],
			})
		)

		assert.deepEqual(
			(
				await contracts.securityTokenPartition.allowance(
					accounts[1],
					accounts[0]
				)
			).toNumber(),
			value
		)

		// 0 transfers value to itself
		await truffleAssert.passes(
			contracts.securityTokenPartition.transferFrom(
				accounts[1],
				accounts[0],
				value,
				{ from: accounts[0] }
			)
		)
	})

	it('can use partition without proxy contract', async () => {
		const somePartition =
			'0x736f6d65506172746974696f6e00000000000000000000000000000000000000' // somePartition

		const value = 100

		// add CAP_EDITOR role
		await contracts.micoboSecurityToken.addRole(Role.CAP_EDITOR, accounts[0])

		// set cap for new partition
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setCapByPartition(
				somePartition,
				conf.standardPartitionCap
			)
		)

		// already is ISSUER

		// issue tokens to new partition
		await truffleAssert.passes(
			contracts.micoboSecurityToken.issueByPartition(
				somePartition,
				accounts[0],
				value,
				'0x0'
			)
		)

		// see if balance is correct
		let balance = (
			await contracts.micoboSecurityToken.balanceOfByPartition(
				somePartition,
				accounts[0]
			)
		).toNumber()

		assert.deepEqual(balance, value)
	})
})
