const truffleAssert = require("truffle-assertions")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const { Role } = require("./Constants")
const { conf } = require("../token-config")

contract("Test Admin Contract", async (accounts) => {
	let contracts

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}
	})

	it("accounts[0] is admin", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[0]), true)
	})

	it("accounts[0] is owner", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.owner(), accounts[0])
	})

	it("can transfer ownership only if admin", async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferOwnership(accounts[1], {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"A7"
		)

		await contracts.micoboSecurityToken.transferOwnership(accounts[1]),
			assert.deepEqual(await contracts.micoboSecurityToken.owner(), accounts[1])
	})

	it("can add and remove roles", async () => {
		// other admin
		await contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[1])

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]), true)

		await contracts.micoboSecurityToken.bulkAddRole(
			[Role.SPENDING_LIMITS_EDITOR, Role.TIME_LOCK_EDITOR, Role.VESTING_PERIOD_EDITOR],
			[accounts[4], accounts[5], accounts[6]]
		)

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.SPENDING_LIMITS_EDITOR, accounts[4]), true)
		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.TIME_LOCK_EDITOR, accounts[5]), true)
		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.VESTING_PERIOD_EDITOR, accounts[6]), true)

		// account that already has the role cannot have the same role assigned again
		await truffleAssert.fails(
			contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[1]),
			truffleAssert.ErrorType.REVERT,
			"already has role"
		)

		await contracts.micoboSecurityToken.removeRole(Role.ADMIN, accounts[1])

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]), false)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.removeRole(Role.MODULE_EDITOR, accounts[1]),
			truffleAssert.ErrorType.REVERT,
			"does not have role"
		)

		// constraintsEditor
		await contracts.micoboSecurityToken.addRole(Role.MODULE_EDITOR, accounts[1])

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.MODULE_EDITOR, accounts[1]), true)

		await contracts.micoboSecurityToken.removeRole(Role.MODULE_EDITOR, accounts[1])

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.MODULE_EDITOR, accounts[1]), false)
	})

	it("can renounce role", async () => {
		// constraintsEditor
		await contracts.micoboSecurityToken.addRole(Role.MODULE_EDITOR, accounts[1])

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.MODULE_EDITOR, accounts[1]), true)

		await contracts.micoboSecurityToken.renounceRole(Role.MODULE_EDITOR, {
			from: accounts[1],
		})

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.MODULE_EDITOR, accounts[1]), false)
	})

	it("cannot renounce role one doesn't have", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.MODULE_EDITOR, accounts[1]), false)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.renounceRole(Role.MODULE_EDITOR, {
				from: accounts[1],
			})
		)
	})

	it("non-admin cannot add nor remove roles", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.ADMIN, accounts[1]), false)

		// give admin role to oneself
		await truffleAssert.fails(
			contracts.micoboSecurityToken.addRole(Role.ADMIN, accounts[1], {
				from: accounts[1],
			})
		)

		// give admin role to oneself through bulk adding
		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkAddRole([Role.ADMIN], [accounts[1]], {
				from: accounts[1],
			})
		)

		// remove admin role from other admin
		await truffleAssert.fails(
			contracts.micoboSecurityToken.removeRole(Role.ADMIN, accounts[0], {
				from: accounts[1],
			})
		)
	})

	it("cannot send odd number of roles and accounts to bulkAddRole", async () => {
		// give admin role to oneself through bulk adding
		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkAddRole([Role.ADMIN, Role.VESTING_PERIOD_EDITOR], [accounts[1]]),
			truffleAssert.ErrorType.REVERT,
			"length"
		)
	})

	it("can set and renew partition controllers", async () => {
		// not admin
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setPartitionControllers(conf.standardPartition, [accounts[0]], {
				from: accounts[1],
			})
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setPartitionControllers(conf.standardPartition, [accounts[0]])
		)

		assert.deepEqual(await contracts.micoboSecurityToken.controllersByPartition(conf.standardPartition), [
			accounts[0],
		])

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setPartitionControllers(conf.standardPartition, [accounts[1], accounts[2]])
		)

		assert.deepEqual(await contracts.micoboSecurityToken.controllersByPartition(conf.standardPartition), [
			accounts[1],
			accounts[2],
		])
	})

	it("can renounce control", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.isControllable(), true)

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.CONTROLLER, accounts[7]), true)

		// fails if not admin
		await truffleAssert.fails(
			contracts.micoboSecurityToken.renounceControl({
				from: accounts[1],
			})
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.renounceControl({
				from: accounts[0],
			})
		)

		assert.deepEqual(await contracts.micoboSecurityToken.isControllable(), false)

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], 100, "0x")

		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				100,
				"0x",
				"0x",
				{ from: accounts[7] }
			)
		)
	})

	it("can renounce issuance", async () => {
		assert.deepEqual(await contracts.micoboSecurityToken.isIssuable(), true)

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.ISSUER, accounts[0]), true)

		// fails if not admin
		await truffleAssert.fails(
			contracts.micoboSecurityToken.renounceIssuance({
				from: accounts[1],
			})
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.renounceIssuance({
				from: accounts[0],
			})
		)

		assert.deepEqual(await contracts.micoboSecurityToken.isIssuable(), false)

		// not able to mint anymore
		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], 100, "0x", {
				from: accounts[0],
			}),
			truffleAssert.ErrorType.REVERT,
			"A8"
		)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				[accounts[0], accounts[1], accounts[2]],
				[10, 20, 30],
				"0x0"
			),
			truffleAssert.ErrorType.REVERT,
			"A8"
		)
	})
})
