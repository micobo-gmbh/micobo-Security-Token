const truffleAssert = require("truffle-assertions")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { Role } = require("./Constants")
const { conf } = require("../token-config")

contract("Test Issuing and Cap", async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		const networkId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[networkId].address),
		}
	})

	it("can get and set cap", async () => {
		assert.deepEqual((await contracts.micoboSecurityToken.cap()).toNumber(), conf.standardCap)

		// not cap editor
		await truffleAssert.fails(contracts.micoboSecurityToken.setCap(conf.standardCap - -100))

		await contracts.micoboSecurityToken.addRole(Role.CAP_EDITOR, accounts[0])

		await truffleAssert.fails(
			contracts.micoboSecurityToken.setCap(conf.standardCap - 100),
			truffleAssert.ErrorType.REVERT,
			"cap"
		)

		await truffleAssert.passes(contracts.micoboSecurityToken.setCap(conf.standardCap - -100))

		assert.deepEqual((await contracts.micoboSecurityToken.cap()).toNumber(), conf.standardCap - -100)
	})

	it("mints tokens to test addresses if minter", async () => {
		// should fail because of granularity
		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value - 1, "0x0"),
			truffleAssert.ErrorType.REVERT,
			"violates granularity"
		)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(
				conf.standardPartition,
				"0x0000000000000000000000000000000000000000",
				value,
				"0x0"
			),
			truffleAssert.ErrorType.REVERT,
			"zero address"
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value, "0x0")
		)

		await contracts.micoboSecurityToken.removeRole(Role.ISSUER, accounts[0])

		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value, "0x0")
		)

		let balance = (
			await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])
		).toNumber()

		assert.deepEqual(await contracts.micoboSecurityToken.totalPartitions(), [conf.standardPartition])

		// console.log("balance: ", balance);

		assert.deepEqual(balance, value)
	})

	it("cannot mint more than cap", async () => {
		await contracts.micoboSecurityToken.addRole(Role.ISSUER, accounts[0])

		await truffleAssert.fails(
			contracts.micoboSecurityToken.issueByPartition(
				conf.standardPartition,
				accounts[0],
				conf.standardCap + 1,
				"0x0"
			)
		)
	})

	it("can mint in bulk", async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.bulkIssueByPartition(
				conf.standardPartition,
				[accounts[0], accounts[1], accounts[2]],
				[10, 20, 30],
				"0x0"
			)
		)

		let balance1 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[0])
		).toNumber()

		assert.deepEqual(balance1, 10)

		let balance2 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])
		).toNumber()

		assert.deepEqual(balance2, value - -20)

		let balance3 = (
			await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[2])
		).toNumber()

		assert.deepEqual(balance3, 30)
	})

	it("can mint multiple times in bulk", async () => {
		var tokenHolders = []
		var values = []

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 10; j++) {
				tokenHolders.push(accounts[j])
				values.push(10)
			}
		}

		await truffleAssert.passes(
			contracts.micoboSecurityToken.bulkIssueByPartition(conf.standardPartition, tokenHolders, values, "0x0")
		)
	})

	it("cannot submit different array lengths", async () => {
		var tokenHolders = []
		var values = []

		tokenHolders.push(accounts[0])
		values.push(10)
		values.push(10)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkIssueByPartition(conf.standardPartition, tokenHolders, values, "0x0"),
			"revert",
			"length"
		)
	})

	it("cannot exceed cap", async () => {
		// should be just too much for the partition
		var capFraction = (conf.standardCap / 40).toFixed(0) + 2

		var tokenHolders = []
		var values = []

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 10; j++) {
				tokenHolders.push(accounts[j])
				values.push(capFraction)
			}
		}

		await truffleAssert.fails(
			contracts.micoboSecurityToken.bulkIssueByPartition(conf.standardPartition, tokenHolders, values, "0x0"),
			"revert",
			"exceeds"
		)
	})
})
