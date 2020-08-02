const truffleAssert = require("truffle-assertions")
const MicoboSecurityToken = artifacts.require("SecurityToken")

const { conf } = require("../token-config")
const { Role, Partitions } = require("./Constants")

contract("Test ERC20 Functionality", async (accounts) => {
	let contracts

	let value = 1000

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value * 2, "0x0")
	})

	it("can get decimals", async () => {
		assert.deepEqual((await contracts.micoboSecurityToken.decimals()).toNumber(), 18)
	})

	it("can get user balance", async () => {
		assert.deepEqual((await contracts.micoboSecurityToken.balanceOf(accounts[0])).toNumber(), value * 2)
	})

	// transfer
	it("can transfer ERC20", async () => {
		await truffleAssert.passes(contracts.micoboSecurityToken.transfer(accounts[1], value))

		assert.deepEqual((await contracts.micoboSecurityToken.balanceOf(accounts[0])).toNumber(), value)

		assert.deepEqual((await contracts.micoboSecurityToken.balanceOf(accounts[1])).toNumber(), value)
	})

	it("can approve and transferFrom", async () => {
		// cannot approve 0 address
		await truffleAssert.fails(
			contracts.micoboSecurityToken.approve("0x0000000000000000000000000000000000000000", value),
			truffleAssert.ErrorType.REVERT,
			"A5"
		)

		await contracts.micoboSecurityToken.approve(accounts[1], value)

		assert.deepEqual((await contracts.micoboSecurityToken.allowance(accounts[0], accounts[1])).toNumber(), value)

		await contracts.micoboSecurityToken.transferFrom(accounts[0], accounts[1], value, { from: accounts[1] })

		// does not have enough allowance
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferFrom(
				"0x0000000000000000000000000000000000000000",
				accounts[1],
				value,
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"A7"
		)

		assert.deepEqual((await contracts.micoboSecurityToken.balanceOf(accounts[0])).toNumber(), 0)

		assert.deepEqual((await contracts.micoboSecurityToken.balanceOf(accounts[1])).toNumber(), value * 2)
	})

	// check ALL partition behaviour (partition overflow)

	it("transfer using all partitions", async () => {
		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(Partitions.SECOND, accounts[1], value * 2, "0x0")

		await contracts.micoboSecurityToken.issueByPartition(Partitions.THIRD, accounts[1], value * 2, "0x0")

		//the transfer works
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transfer(accounts[0], value * 3, {
				from: accounts[1],
			})
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(Partitions.BASE, accounts[1])).toNumber(),
			0
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(Partitions.SECOND, accounts[1])).toNumber(),
			value
		)

		// transfer more
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transfer(accounts[0], value * 2, {
				from: accounts[1],
			})
		)

		// the order of total partitions seems to change and the THIRD is being used to transfer all 2000
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(Partitions.BASE, accounts[1])).toNumber(),
			0
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(Partitions.SECOND, accounts[1])).toNumber(),
			1000
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(Partitions.THIRD, accounts[1])).toNumber(),
			0
		)
	})
})
