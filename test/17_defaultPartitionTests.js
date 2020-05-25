const truffleAssert = require("truffle-assertions")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const { conf } = require("../token-config")
const { Role, Partitions } = require("./Constants")

contract("Test default partition behaviour", async (accounts) => {
	let contracts

	let value = 1000

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value, "0x0")
	})

	it("can read partitions for accounts", async () => {
		let partitions = await contracts.micoboSecurityToken.partitionsOf(accounts[0])

		assert.deepEqual(partitions, [conf.standardPartition])
	})

	it("can read default partitions", async () => {
		let res = await contracts.micoboSecurityToken.getDefaultPartitions()

		assert.deepEqual(res, [conf.standardPartition])
	})

	it("can set default partitions", async () => {
		// not default partitions editor
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setDefaultPartitions([Partitions.BASE, Partitions.SECOND, Partitions.THIRD])
		)

		// add role
		await contracts.micoboSecurityToken.addRole(Role.DEFAULT_PARTITIONS_EDITOR, accounts[0])

		// now it works
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setDefaultPartitions([Partitions.BASE, Partitions.SECOND, Partitions.THIRD])
		)

		let res = await contracts.micoboSecurityToken.getDefaultPartitions()

		assert.deepEqual(res, [Partitions.BASE, Partitions.SECOND, Partitions.THIRD])
	})

	it("cannot transfer by default partition if no default partition is set", async () => {
		await contracts.micoboSecurityToken.setDefaultPartitions([])

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferWithData(accounts[1], value, "0x"),
			truffleAssert.ErrorType.REVERT,
			"A8"
		)
	})
})
