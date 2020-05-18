const truffleAssert = require('truffle-assertions')
const { conf } = require('../token-config')
const { Role } = require('./Constants')
const MicoboSecurityToken = artifacts.require('SecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')
const GSNModule = artifacts.require('GSNModule')

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

	let relayHub

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
			relayHub = await deployRelayHub(web3)

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
			value * 3,
			'0x0'
		)
	})

	it('can read relayHub version', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.relayHubVersion(),
			'1.0.0'
		)
	})

	it('can add a role over GSN', async () => {
		// Sends the transaction via the GSN

		let tx = await contracts.micoboSecurityToken.addRole(
			Role.ADMIN,
			accounts[1],
			{
				from: accounts[0],
				useGSN: true,
				gas: 104310,
				gasPrice: 20000000000,
			}
		)
		console.log(tx['tx'])

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]),
			true
		)
	})

	it('can transfer tokens for free', async () => {
		await transferWithGSN()
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
				gasPrice: 20000000000,
			}
		)
		console.log(tx['tx'])

		// console.log(balance)

		assert.deepEqual(
			(
				await contracts.securityTokenPartition.balanceOf(accounts[1])
			).toNumber(),
			balance + value
		)
	})

	it('cannot deactivate GSN if not GSN_CONTROLLER', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setGSNMode(GSNMode.NONE, {
				from: accounts[0],
			})
		)
	})

	it('cannot deactivate GSN if not GSN_CONTROLLER in PartitionProxy', async () => {
		await truffleAssert.fails(
			contracts.securityTokenPartition.setGSNMode(GSNMode.NONE, {
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

	it('can deactivate GSN if GSN_CONTROLLER in PartitionProxy', async () => {
		await truffleAssert.passes(
			contracts.securityTokenPartition.setGSNMode(GSNMode.NONE, {
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
				gasPrice: 20000000000,
			})
		)

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[2]),
			false
		)
	})

	it('can set and use GSN Module', async () => {
		await contracts.micoboSecurityToken.setGSNMode(GSNMode.MODULE, {
			from: accounts[0],
		})

		let gsnModule = await GSNModule.new()

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setGSNModule(gsnModule.address)
		)

		await transferWithGSN()
	})

	it('can upgrade relay hub', async () => {
		const newHub = '0x09226Fc4a70ff15Ed2E6aaa8eb37702122633d6A' //random address
		await contracts.micoboSecurityToken.upgradeRelayHub(newHub)

		assert.deepEqual(await contracts.micoboSecurityToken.getHubAddr(), newHub)

		await contracts.micoboSecurityToken.upgradeRelayHub(relayHub)
	})

	it('can withdraw deposit', async () => {
		// using account 1 so that gas consumption does not change eth balance of account 0
		await contracts.micoboSecurityToken.addRole(
			Role.GSN_CONTROLLER,
			accounts[1]
		)

		const balance = await web3.eth.getBalance(accounts[0])

		console.log(balance)

		let tx = await contracts.micoboSecurityToken.withdrawDeposits(
			1000,
			accounts[0],
			{ from: accounts[1] }
		)

		// console.log(tx)

		assert.deepEqual(
			(await web3.eth.getBalance(accounts[0])) - 0, // convert to number
			balance - -1000
		)
	})

	transferWithGSN = async () => {
		const balance = await web3.eth.getBalance(accounts[0])

		const tokenBalance0 = await contracts.micoboSecurityToken.balanceOfByPartition(
			conf.standardPartition,
			accounts[0]
		)

		const tokenBalance1 = await contracts.micoboSecurityToken.balanceOfByPartition(
			conf.standardPartition,
			accounts[1]
		)

		// can transfer tokens
		let tx = await contracts.micoboSecurityToken.transferByPartition(
			conf.standardPartition,
			accounts[1],
			value,
			'0x0',
			{
				from: accounts[0],
				useGSN: true,
				gas: 231532,
				gasPrice: 20000000000,
			}
		)
		console.log(tx['tx'])

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
	}
})
