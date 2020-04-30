const truffleAssert = require('truffle-assertions')
const { conf } = require('../token-config')
const { Role } = require('./Roles')
const MicoboSecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')

const {
	deployRelayHub,
	runRelayer,
	fundRecipient,
	registerRelay,
} = require('@openzeppelin/gsn-helpers')

const GSNMode = {
	ALL: 0,
	MODULE: 1,
	NONE: 2,
}

// TODO add tests with GSN Module

contract('Test GSN functionality', async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// deploy proxy
		contracts['securityTokenPartition'] = await SecurityTokenPartition.new(
			contracts.micoboSecurityToken.address,
			conf.standardPartition
		)

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



		// console.log(contracts.micoboSecurityToken.address)

		// setup GSN
		try {
			await deployRelayHub(web3)

			// start relayer before with
			// % npx oz-gsn run-relayer --ethereumNodeURL http://localhost:8545 --quiet

			await registerRelay(web3, {
				relayUrl: 'http://localhost:8090',
				stake: 1000000000000000000, // 1 eth
				unstakeDelay: 604800, // 1 week
				funds: 0,
				from: accounts[0],
			})

			await fundRecipient(web3, {
				recipient: contracts.micoboSecurityToken.address,
				// amount: 0, // use standard 1 eth
			})

			await fundRecipient(web3, {
				recipient: contracts.securityTokenPartition.address,
				// amount: 0, // use standard 1 eth
			})
		} catch (e) {
			throw e
		}

		// mint some tokens

		// make me minter
		await contracts.micoboSecurityToken.addRole(Role.ISSUER, accounts[0])

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value * 2,
			'0x0'
		)
	})

	// TODO test other functions
	// although this should work with all of them

	it('can add a role over GSN', async () => {
		// Sends the transaction via the GSN
		await truffleAssert.passes(
			contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[1], {
				from: accounts[0],
				useGSN: true,
				gasLimit: 147049,
			})
		)

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]),
			true
		)
	})

	it('can transfer tokens for free', async () => {
		const balance = await web3.eth.getBalance(accounts[0])

		// can transfer tokens
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{
					from: accounts[0],
					useGSN: true,
				}
			)
		)

		assert.deepEqual(await web3.eth.getBalance(accounts[0]), balance)
	})

	it('cannot deactivate GSN if not GSN_CONTROLLER', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setGSNMode(GSNMode.NONE, {
				from: accounts[0],
			})
		)
	})

	it('can deactivate GSN if GSN_CONTROLLER', async () => {
		await contracts.micoboSecurityToken.addRole(
			Role.GSN_CONTROLLER,
			accounts[0]
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setGSNMode(GSNMode.NONE, {
				from: accounts[0],
			})
		)
	})

	it('cannot add a role over GSN if deactivated', async () => {
		await contracts.micoboSecurityToken.setGSNMode(GSNMode.NONE, {
			from: accounts[0],
		})

		// Sends the transaction via the GSN
		await truffleAssert.fails(
			contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[2], {
				from: accounts[0],
				useGSN: true,
				gasLimit: 147049,
			})
		)

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[2]),
			false
		)
	})

	it('can transfer using proxy and GSN', async () => {
	
		const balance = (
			await contracts.securityTokenPartition.balanceOf(accounts[1])
		).toNumber()

		// Sends the transaction via the GSN
		await truffleAssert.passes(
			contracts.securityTokenPartition.transfer(accounts[1], value, {
				from: accounts[0],
				useGSN: true,
				gasLimit: 154988,
			})
		)

		// console.log(balance)

		assert.deepEqual(
			(
				await contracts.securityTokenPartition.balanceOf(accounts[1])
			).toNumber(),
			balance + value
		)
	})
})
