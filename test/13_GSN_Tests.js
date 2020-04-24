const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

const {
	deployRelayHub,
	runRelayer,
	fundRecipient,
	registerRelay,
} = require('@openzeppelin/gsn-helpers')

const abi = require('../build/contracts/SecurityToken.json').abi

const { deployAllContracts, Role, Code } = require('./deployment.js')

const Web3 = require('web3')
const { GSNProvider } = require('@openzeppelin/gsn-provider')

const web3 = new Web3(new GSNProvider('http://localhost:8545'))

const directweb3 = new Web3('http://localhost:8545')

contract('Test GSN functionality', async (accounts) => {
	let contracts
	let myContract

	// deepEqual compares with '==='

	before(async () => {
		contracts = await deployAllContracts(accounts)

		myContract = new web3.eth.Contract(
			abi,
			contracts.micoboSecurityToken.address
		)

		// console.log(contracts.micoboSecurityToken.address)

		try {
			await deployRelayHub(directweb3)

			// start relayer before with
			// % npx oz-gsn run-relayer --ethereumNodeURL http://localhost:8545 --quiet

			await registerRelay(directweb3, {
				relayUrl: 'http://localhost:8090',
				stake: 1000000000000000000, // 1 eth
				unstakeDelay: 604800, // 1 week
				funds: 0,
				from: accounts[0],
			})

			await fundRecipient(directweb3, {
				recipient: contracts.micoboSecurityToken.address,
				// amount: 0, // use standard 1 eth
			})
		} catch (e) {
			console.error(e)
		}

		// console.log('testing GSN')
	})

	// TODO test other functions
	// although this should work with all of them
	
	it('can add a role over GSN', async () => {
		/* await contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[1]); */

		// Sends the transaction via the GSN
		tx = await myContract.methods.addRole(Role.ADMIN, accounts[1]).send({
			from: '0xAb70e89013a37d8F9616205a9E09252C4f815abf',
			useGSN: true,
			gasLimit: 147049,
		})

		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]),
			true
		)
	})
})
