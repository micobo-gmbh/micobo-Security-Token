const truffleAssert = require("truffle-assertions")
const MicoboSecurityToken = artifacts.require("SecurityToken")
const PauseConstraintModule = artifacts.require("PauseConstraintModule")

const { conf } = require("../token-config")
const { Role } = require("./Constants")

contract("Test Token Transfer", async (accounts) => {
	let contracts

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

	it("can send tokens", async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[0], value, "0x0", {
				from: accounts[1],
			})
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[0])).toNumber(),
			value - -value
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value - value
		)
	})

	it("can send tokens using operator functionality", async () => {
		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				value,
				"0x0",
				"0x0",
				{ from: accounts[1] }
			)
		)

		// authorize 0 from 1
		await contracts.micoboSecurityToken.authorizeOperatorByPartition(conf.standardPartition, accounts[1], {
			from: accounts[0],
		})

		assert.deepEqual(
			await contracts.micoboSecurityToken.isOperatorForPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0]
			),
			true
		)

		// now can transfer
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				value,
				"0x0",
				"0x0",
				{ from: accounts[1] }
			)
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[0])).toNumber(),
			value
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value
		)

		// revoke 0 from 1
		await contracts.micoboSecurityToken.revokeOperatorByPartition(conf.standardPartition, accounts[1], {
			from: accounts[0],
		})

		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				value,
				"0x0",
				"0x0",
				{ from: accounts[1] }
			)
		)
	})

	it("can send tokens if controller", async () => {
		// cannot transfer when not operator or controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				value,
				"0x0",
				"0x0",
				{ from: accounts[1] }
			)
		)

		// make controller
		await contracts.micoboSecurityToken.addRole(Role.CONTROLLER, accounts[1])

		// can force transfer when controller
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[0],
				accounts[1],
				value,
				"0x0",
				"0x0",
				{ from: accounts[1] }
			)
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[0])).toNumber(),
			value - value
		)

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value - -value
		)
	})

	it("can transfer between partitions", async () => {
		flag = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
		newPartition = web3.utils.keccak256("newPartition")

		data = flag + newPartition.substring(2)

		// console.log(data)

		// transfer tokens to a new partition
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				data,
				// operator data length > 0
				"0x0",
				{ from: accounts[7] }
			)
		)

		// new partition added
		assert.deepEqual(await contracts.micoboSecurityToken.totalPartitions(), [conf.standardPartition, newPartition])

		// check balance on new partition
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(newPartition, accounts[0])).toNumber(),
			value
		)

		// on base partition
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value
		)

		// if flag wrong, will use same partition
		wrongFlag = "0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
		data = wrongFlag + newPartition.substring(2)

		await contracts.micoboSecurityToken.operatorTransferByPartition(
			conf.standardPartition,
			accounts[1],
			accounts[0],
			value,
			data,
			// operator data length > 0
			"0x0",
			{ from: accounts[7] }
		)

		// check balance on base partition
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			0
		)
	})

	it("RIVER principle works as intended", async () => {
		// 0 transfers fund from newPartition
		contracts.micoboSecurityToken.transferByPartition(newPartition, accounts[1], value, "0x")

		// newPartition doesn't exist anymore
		assert.deepEqual(await contracts.micoboSecurityToken.totalPartitions(), [conf.standardPartition])

		// check balance on new partition
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(newPartition, accounts[0])).toNumber(),
			0
		)

		// check balance on base partition
		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value
		)
	})

	it("can CAN operatorTransfer", async () => {
		// not if not controller

		let res = await contracts.micoboSecurityToken.canOperatorTransferByPartition(
			conf.standardPartition,
			accounts[1],
			accounts[0],
			value,
			"0x",
			"0x",
			{ from: accounts[3] }
		)

		assert.deepEqual(res["0"], "0xa7")

		// passes when controller
		let res2 = await contracts.micoboSecurityToken.canOperatorTransferByPartition(
			conf.standardPartition,
			accounts[1],
			accounts[0],
			value,
			"0x",
			"0x",
			{ from: accounts[7] }
		)

		assert.deepEqual(res2["0"], "0xa2")

		// using authorizeOperatorByPartition
		await contracts.micoboSecurityToken.authorizeOperatorByPartition(conf.standardPartition, accounts[6], {
			from: accounts[1],
		})

		// passes when operator
		let res3 = await contracts.micoboSecurityToken.canOperatorTransferByPartition(
			conf.standardPartition,
			accounts[1],
			accounts[0],
			value,
			"0x",
			"0x",
			{ from: accounts[6] }
		)

		assert.deepEqual(res3["0"], "0xa2")
	})

	it("can CAN transfer", async () => {
		// not enough balance
		let res = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			value * 3,
			"0x"
		)

		assert.deepEqual(res["0"], "0xa4")

		// zero address
		let res2 = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			"0x0000000000000000000000000000000000000000",
			value,
			"0x",
			{ from: accounts[1] }
		)

		assert.deepEqual(res2["0"], "0xa6")

		// granularity
		let res3 = await contracts.micoboSecurityToken.canTransferByPartition(
			conf.standardPartition,
			accounts[1],
			1,
			"0x",
			{ from: accounts[1] }
		)

		assert.deepEqual(res3["0"], "0xa9")
	})

	it("controller bypasses constraints modules", async () => {
		pauseConstraintModule = await PauseConstraintModule.new(contracts.micoboSecurityToken.address)

		await contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, [
			pauseConstraintModule.address,
		])

		// pause it
		await contracts.micoboSecurityToken.addRole(Role.PAUSER, accounts[0])
		await pauseConstraintModule.pause()

		assert.deepEqual(await pauseConstraintModule.paused(), true)

		// fails if not controller
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[1], value, "0x0", {
				from: accounts[0],
			})
		)

		assert.deepEqual(await contracts.micoboSecurityToken.hasRole(Role.CONTROLLER, accounts[7]), true)

		// controller bypasses constraints
		await truffleAssert.passes(
			contracts.micoboSecurityToken.operatorTransferByPartition(
				conf.standardPartition,
				accounts[1],
				accounts[0],
				value,
				"0x",
				"0x",
				{ from: accounts[7] }
			)
		)

		await pauseConstraintModule.unpause()
	})

	it("can ERC1400Raw transfer", async () => {
		await truffleAssert.passes(contracts.micoboSecurityToken.transferWithData(accounts[1], value, "0x"))

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value
		)
	})

	it("can ERC1400Raw transferFrom", async () => {
		await contracts.micoboSecurityToken.authorizeOperator(accounts[2], {
			from: accounts[1],
		})

		assert.deepEqual(await contracts.micoboSecurityToken.isOperator(accounts[2], accounts[1]), true)

		await contracts.micoboSecurityToken.revokeOperator(accounts[2], {
			from: accounts[1],
		})

		assert.deepEqual(await contracts.micoboSecurityToken.isOperator(accounts[2], accounts[1]), false)

		await contracts.micoboSecurityToken.authorizeOperator(accounts[2], {
			from: accounts[1],
		})

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferFromWithData(accounts[1], accounts[2], value, "0x", "0x", {
				from: accounts[2],
			})
		)
	})
})
