const PauseConstraintModule = artifacts.require("PauseConstraintModule")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const truffleAssert = require("truffle-assertions")

const { conf } = require("../token-config")
const { Role, Module } = require("./Constants")

contract("Test Pausing", async (accounts) => {
	let contracts, pauseConstraintModule

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value, "0x0")

		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value, "0x0")
	})

	it("deploy PauseConstraintModule", async () => {
		pauseConstraintModule = await PauseConstraintModule.new(contracts.micoboSecurityToken.address)
	})

	it("register PauseConstraintModule", async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, [pauseConstraintModule.address])
		)
	})

	// PAUSING UND UNPAUSING

	it("pauser can pause and unpause contract", async () => {
		// without being pauser
		await truffleAssert.fails(pauseConstraintModule.pause())

		// make pauser
		await contracts.micoboSecurityToken.addRole(Role.PAUSER, accounts[0])

		// being pauser
		await truffleAssert.passes(pauseConstraintModule.pause())

		// is paused
		assert.deepEqual(await pauseConstraintModule.paused(), true)

		await contracts.micoboSecurityToken.removeRole(Role.PAUSER, accounts[0])

		// fails to unpause when not pauser
		await truffleAssert.fails(pauseConstraintModule.unpause())

		await contracts.micoboSecurityToken.addRole(Role.PAUSER, accounts[0])

		// unopause being pauser
		await truffleAssert.passes(pauseConstraintModule.unpause())

		// is unpaused again
		assert.deepEqual(await pauseConstraintModule.paused(), false)
	})

	it("cannot unpause contract if unpaused and vice versa", async () => {
		assert.deepEqual(await pauseConstraintModule.paused(), false)

		// unpause fails
		await truffleAssert.fails(pauseConstraintModule.unpause())

		await truffleAssert.passes(pauseConstraintModule.pause())

		assert.deepEqual(await pauseConstraintModule.paused(), true)

		await truffleAssert.fails(pauseConstraintModule.pause())

		await truffleAssert.passes(pauseConstraintModule.unpause())
	})

	// LIMITS WHEN PAUSED

	it("cannot transfer tokens if paused", async () => {
		// if setModulesByPartition succeeded

		await truffleAssert.passes(pauseConstraintModule.pause())

		assert.deepEqual(await pauseConstraintModule.paused(), true)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)

		await truffleAssert.passes(pauseConstraintModule.unpause())

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})

	it("gets correct module name", async () => {
		assert.deepEqual(await pauseConstraintModule.getModuleName(), Module.PAUSE)
	})
})
