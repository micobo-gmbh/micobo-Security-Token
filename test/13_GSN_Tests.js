const truffleAssert = require('truffle-assertions')
const conf = require('../token-config')
const {
	deployRelayHub,
	runRelayer,
	fundRecipient,
	registerRelay,
} = require('@openzeppelin/gsn-helpers')

const { getDeployedContracts, Role, Code } = require('./deployment.js')

contract('Test GSN functionality', async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = await getDeployedContracts(accounts)

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
			console.error("Error setting up GSN", e)
		}

		// mint some tokens

		// make me minter
		await contracts.micoboSecurityToken.addRole(Role.MINTER, accounts[0])

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

	it('cannot deactivate GSN if not admin', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setGSNMode(2, {
				from: accounts[2],
			})
		)
	})

	it('cannot add a role over GSN if deactivated', async () => {
		await contracts.micoboSecurityToken.setGSNMode(2, {
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
		// Sends the transaction via the GSN
		await truffleAssert.passes(
			contracts.securityTokenPartition.transfer(accounts[1], value, {
				from: accounts[0],
				useGSN: true,
				gasLimit: 154988,
			})
		)

		let balance = (
			await contracts.securityTokenPartition.balanceOf(accounts[1])
		).toNumber()

		// console.log(balance)

		assert.deepEqual(balance, value * 2)
	})
})
