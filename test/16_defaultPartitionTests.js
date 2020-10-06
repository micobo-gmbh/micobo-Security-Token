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
})
