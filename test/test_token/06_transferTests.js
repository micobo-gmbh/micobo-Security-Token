const truffleAssert = require("truffle-assertions")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")
const TimeLockConstraintModule = artifacts.require("TimeLockConstraintModule")

const { conf } = require("../token-config")
const { Role } = require("./Constants")

contract("Test Token Transfer", async (accounts) => {
	let contracts

	let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		const networkId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[networkId].address),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value, "0x0")

		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[1], value, "0x0")
	})

	it("can send tokens", async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				"0x0000000000000000000000000000000000000000",
				value,
				"0x0",
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"zero address"
		)

		// never reaches ERC1400Raw.sol:318
		// reaches ERC1400Partition.sol:260
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[0],
				100000000000000,
				"0x0",
				{ from: accounts[1] }
			),
			truffleAssert.ErrorType.REVERT,
			"insufficient funds"
		)

		// fails granularity test
		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(conf.standardPartition, accounts[0], value - 1, "0x0", {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			"violates granularity"
		)

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
		await contracts.micoboSecurityToken.transferByPartition(newPartition, accounts[1], value, "0x")

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

	it("controller bypasses constraints modules", async () => {
		timeLockConstraintModule = await TimeLockConstraintModule.new(contracts.micoboSecurityToken.address)

		await contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, [
			timeLockConstraintModule.address,
		])

		// lock it
		await contracts.micoboSecurityToken.addRole(Role.TIME_LOCK_EDITOR, accounts[0])
		await timeLockConstraintModule.editTimeLock(1893456000) // 01/01/2030 @ 12:00 (UTC)

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

		//reset
		await timeLockConstraintModule.editTimeLock(1577836800) // 01/01/2020 @ 12:00 (UTC)
	})

	it("can ERC1400Raw transfer", async () => {
		await truffleAssert.passes(contracts.micoboSecurityToken.transferWithData(accounts[1], value, "0x"))

		assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(conf.standardPartition, accounts[1])).toNumber(),
			value
		)
	})

	it("can ERC1400Raw transferFrom", async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.authorizeOperator(accounts[1], {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			""
		)

		await contracts.micoboSecurityToken.authorizeOperator(accounts[2], {
			from: accounts[1],
		})

		assert.deepEqual(await contracts.micoboSecurityToken.isOperator(accounts[2], accounts[1]), true)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.revokeOperator(accounts[1], {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT,
			""
		)

		await contracts.micoboSecurityToken.revokeOperator(accounts[2], {
			from: accounts[1],
		})

		assert.deepEqual(await contracts.micoboSecurityToken.isOperator(accounts[2], accounts[1]), false)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferFromWithData(accounts[1], accounts[2], value, "0x", "0x", {
				from: accounts[2],
			}),
			truffleAssert.ErrorType.REVERT,
			"!operator"
		)

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
