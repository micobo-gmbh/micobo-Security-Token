/*
	Test constraint contract functionality and updatability
 */
const ConstraintsLogic = artifacts.require('ConstraintsLogic')
const NewConstraintsLogic = artifacts.require('NewConstraintsLogic')

const {deployAllContracts, Role, Code} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Constraint Contract', async (accounts) => {
	let contracts

	let constraintsEditor = accounts[1]
	let constraintsUpdater = accounts[2]

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts(accounts[0])

	})


	it("can edit and get userList entries when ConstraintsEditor", async () => {

		// should fail because is not ConstraintsEditor
		await truffleAssert.fails(
			contracts.constraintsInterface.editUserList(accounts[0], Code.SEND, 1)
		)

		// constraintsEditor
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, constraintsEditor)

		// now it should work
		await truffleAssert.passes(
			contracts.constraintsInterface.editUserList(accounts[0], Code.SEND, 1, {from: constraintsEditor})
		)

		// The master's UserList entry "0" is "1", after being changed by the logic lib using "delegatecall"
		assert.deepEqual(
			(await contracts.constraintsInterface.getUserListEntry(accounts[0], Code.SEND)).toString(10),
			'1'
		)
	})


	it("can update logic contract only when ConstraintsUpdater", async () => {

		contracts.constraintsLogic = await ConstraintsLogic.new()

		// should fail because is not constraintsUpdater
		await truffleAssert.fails(
			contracts.constraintsMaster.updateLogicContract(contracts.constraintsLogic.address)
		)

		// make constraintsUpdater
		await contracts.adminInterface.add(Role.CONSTRAINTS_UPDATER, constraintsUpdater)

		// now it should pass
		await truffleAssert.passes(
			contracts.constraintsMaster.updateLogicContract(contracts.constraintsLogic.address, {from: constraintsUpdater})
		)

		// The new ConstraintsLogic address has been saved to the master's storage
		assert.deepEqual(
			await contracts.constraintsMaster.constraintsLogicAddress(),
			contracts.constraintsLogic.address
		)
	})


	it("keeps the storage unaffected by new logic contract", async () => {
		await contracts.constraintsInterface.editUserList(accounts[0], Code.RECEIVE, 1, {from: constraintsEditor})

		constraintsLogic = await ConstraintsLogic.new()

		await contracts.constraintsMaster.updateLogicContract(constraintsLogic.address, {from: constraintsUpdater})

		assert.deepEqual(
			(await contracts.constraintsInterface.getUserListEntry(accounts[0], Code.RECEIVE)).toString(10),
			'1'
		)
	})


	it("new different contract keeps storage and extends functionality", async () => {
		// make me minter
		await contracts.adminInterface.add(Role.MINTER, accounts[0])

		// mint tokens for me
		await contracts.compliantTokenInterface.mint(accounts[0], 1000);

		// add whitelist entries
		await contracts.constraintsInterface.editUserList(accounts[0], Code.SEND, 1, {from: constraintsEditor})

		await contracts.constraintsInterface.editUserList(accounts[1], Code.RECEIVE, 1, {from: constraintsEditor})

		// transfer should work
		await truffleAssert.passes(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)

		// deploy NewConstraintsLogic
		newConstraintsLogic = await NewConstraintsLogic.new()

		await contracts.constraintsMaster.updateLogicContract(newConstraintsLogic.address, {from: constraintsUpdater})


		// should throw because of new 1234 constraint
		await truffleAssert.fails(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)

		// now edit the new constraint to be 1234
		await contracts.constraintsInterface.editUserList(accounts[0], Code.SOME_NEW_CODE, 1234, {from: constraintsEditor})

		// now it should work again
		await truffleAssert.passes(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)

	})

})
