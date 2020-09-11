const TimeLockConstraintModule = artifacts.require("TimeLockConstraintModule")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const truffleAssert = require("truffle-assertions")

const { conf } = require("../token-config")
const { Role, Module } = require("./Constants")

contract("Test TimeLock Module", async (accounts) => {
	let contracts, timeLockConstraintModule

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value * 5, "0x0")

		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value * 5, "0x0")
	})

	it("deploy TimeLockConstraintModule", async () => {
		timeLockConstraintModule = await TimeLockConstraintModule.new(contracts.micoboSecurityToken.address)
	})

	it("register TimeLockConstraintModule", async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, [
				timeLockConstraintModule.address,
			])
		)
	})

	it("can edit timelock when time_lock_editor", async () => {
		await truffleAssert.fails(
			timeLockConstraintModule.editTimeLock(1893456000) // 01/01/2030 @ 12:00 (UTC)
		)

		await truffleAssert.fails(
			timeLockConstraintModule.editAccountTimeLock(accounts[0], 1893456000) // 01/01/2030 @ 12:00 (UTC)
		)

		await contracts.micoboSecurityToken.addRole(Role.TIME_LOCK_EDITOR, accounts[0])

		await truffleAssert.passes(
			timeLockConstraintModule.editTimeLock(1893456000) // 01/01/2030 @ 12:00 (UTC)
		)

		await truffleAssert.passes(
			timeLockConstraintModule.editAccountTimeLock(accounts[0], 1893456000) // 01/01/2030 @ 12:00 (UTC)
		)

		//reset
		await timeLockConstraintModule.editTimeLock(1577836800) // 01/01/2020 @ 12:00 (UTC)
		await timeLockConstraintModule.editAccountTimeLock(accounts[0], 1577836800) // 01/01/2020 @ 12:00 (UTC)
	})

	it("cannot transfer when timelocked", async () => {
		await timeLockConstraintModule.editTimeLock(1893456000) // 01/01/2030 @ 12:00 (UTC)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})

	it("can transfer when timelock over", async () => {
		await timeLockConstraintModule.editTimeLock(1577836800) // 01/01/2020 @ 12:00 (UTC)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})

	it("cannot transfer when account timelocked", async () => {
		await timeLockConstraintModule.editAccountTimeLock(accounts[0], 1893456000) // 01/01/2030 @ 12:00 (UTC)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			}),
			"A8 - account is still locked"
		)
	})

	it("can transfer when account timelock over", async () => {
		await timeLockConstraintModule.editAccountTimeLock(accounts[0], 1577836800) // 01/01/2020 @ 12:00 (UTC)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})

	it("cannot transfer when amount timelocked", async () => {
		// we lock 2500
		await timeLockConstraintModule.editAmountTimeLock(accounts[0], 1893456000, 2500) // 01/01/2030 @ 12:00 (UTC)

		// transfer of 1000 fails
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			}),
			"A8 - amount is still locked"
		)
	})

	it("can transfer when amount timelocked is not too great", async () => {
		// we lock 1500
		await timeLockConstraintModule.editAmountTimeLock(accounts[0], 1577836800, 1500) // 01/01/2030 @ 12:00 (UTC)

		// transfer of 1000 succeeds
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)
	})

	it("gets correct module name", async () => {
		assert.deepEqual(await timeLockConstraintModule.getModuleName(), Module.TIME_LOCK)
	})
})
