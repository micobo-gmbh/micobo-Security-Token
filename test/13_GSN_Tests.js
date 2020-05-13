const truffleAssert = require('truffle-assertions')
const { conf } = require('../token-config')
const { Role } = require('./Constants')
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

		// add partition
		await contracts.micoboSecurityToken.addPartitionProxy(
			conf.standardPartition,
			contracts.securityTokenPartition.address
		)

		// console.log(contracts.micoboSecurityToken.address)

		// setup GSN
		try {
			await deployRelayHub(web3)

			// start relayer before with
			// % npx oz-gsn run-relayer --ethereumNodeURL http://localhost:8545

			await registerRelay(web3)

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

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value * 2,
			'0x0'
		)
	})

	// TODO test other functions than addRole, transferByPartition and transfer
	// although this should work with all of them

	it('can add a role over GSN', async () => {
		// Sends the transaction via the GSN

		let tx = await contracts.micoboSecurityToken.addRole(
			Role.ADMIN,
			accounts[1],
			{
				from: accounts[0],
				useGSN: true,
				gas: 104310,
				gasPrice: 2000000000,
			}
		)
		console.log(tx["tx"])

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]),
			true
		)
	})

	it('can transfer tokens for free', async () => {
		const balance = await web3.eth.getBalance(accounts[0])

		const tokenBalance0 = await contracts.micoboSecurityToken.balanceOfByPartition(
			conf.standardPartition,
			accounts[0]
		)

		const tokenBalance1 = await contracts.micoboSecurityToken.balanceOfByPartition(
			conf.standardPartition,
			accounts[1]
		)

		// can transfer tokens≤
		let tx = await contracts.micoboSecurityToken.transferByPartition(
			conf.standardPartition,
			accounts[1],
			value,
			'0x0',
			{
				from: accounts[0],
				useGSN: true,
				gas: 231532,
				gasPrice: 2000000000,
			}
		)
		console.log(tx["tx"])

		// tokens have been transferred
		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[0]
				)
			).toNumber(),
			tokenBalance0 - value
		)

		assert.deepEqual(
			(
				await contracts.micoboSecurityToken.balanceOfByPartition(
					conf.standardPartition,
					accounts[1]
				)
			).toNumber(),
			tokenBalance1 - -value
		)

		// ether balance is unchanged
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
				gas: 104310,
				gasPrice: 2000000000,
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

		let tx = await contracts.securityTokenPartition.transfer(
			accounts[1],
			value,
			{
				from: accounts[0],
				useGSN: true,
				gas: 192366, // 92366
				gasPrice: 2000000000,
			}
		)
		console.log(tx["tx"])

		// console.log(balance)

		assert.deepEqual(
			(
				await contracts.securityTokenPartition.balanceOf(accounts[1])
			).toNumber(),
			balance + value
		)
	})
})
