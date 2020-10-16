const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const truffleAssert = require("truffle-assertions")

const { conf } = require("../token-config")
const { Role } = require("./Constants")

contract("Test Pausing", async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value, "0x0")

		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value, "0x0")
	})

	// PAUSING UND UNPAUSING

	it("pauser can pause and unpause contract", async () => {
		// without being pauser
		await truffleAssert.fails(contracts.micoboSecurityToken.pause())

		// make pauser
		await contracts.micoboSecurityToken.addRole(Role.PAUSER, accounts[0])

		// being pauser
		await truffleAssert.passes(contracts.micoboSecurityToken.pause())

		// is paused
		assert.deepEqual(await contracts.micoboSecurityToken.paused(), true)

		await contracts.micoboSecurityToken.removeRole(Role.PAUSER, accounts[0])

		// fails to unpause when not pauser
		await truffleAssert.fails(contracts.micoboSecurityToken.unpause())

		await contracts.micoboSecurityToken.addRole(Role.PAUSER, accounts[0])

		// unopause being pauser
		await truffleAssert.passes(contracts.micoboSecurityToken.unpause())

		// is unpaused again
		assert.deepEqual(await contracts.micoboSecurityToken.paused(), false)
	})

	it("cannot unpause contract if unpaused and vice versa", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.paused(), false)

		// unpause fails
		await truffleAssert.fails(contracts.micoboSecurityToken.unpause())

		await truffleAssert.passes(contracts.micoboSecurityToken.pause())

		assert.deepEqual(await contracts.micoboSecurityToken.paused(), true)

		await truffleAssert.fails(contracts.micoboSecurityToken.pause())

		await truffleAssert.passes(contracts.micoboSecurityToken.unpause())
	})

	// LIMITS WHEN PAUSED

	it("cannot transfer tokens if paused", async () => {
		// if setModulesByPartition succeeded

		await truffleAssert.passes(contracts.micoboSecurityToken.pause())

		assert.deepEqual(await contracts.micoboSecurityToken.paused(), true)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)

		await truffleAssert.passes(contracts.micoboSecurityToken.unpause())

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})
})
