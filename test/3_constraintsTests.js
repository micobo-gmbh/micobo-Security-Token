/*
	Test constraint contract functionality and updatability
 */
const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const NewConstraintsLogicContract = artifacts.require('NewConstraintsLogicContract')

const {deployAllContracts, Role} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Constraint Contract', async (accounts) => {
	let contracts

	let constraintsEditor = accounts[1]
	let constraintsUpdater = accounts[2]

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts()

	})


	it("can edit and get userList entries when ConstraintsEditor", async () => {

		// should fail because is not ConstraintsEditor
		await truffleAssert.fails(
			contracts.constraintsInterface.editUserList(accounts[0], 0, 1)
		)

		// constraintsEditor
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, constraintsEditor)

		// now it should work
		await truffleAssert.passes(
			contracts.constraintsInterface.editUserList(accounts[0], 0, 1, {from: constraintsEditor})
		)

		// The proxy's UserList entry "0" is "1", after being changed by the logic lib using "delegatecall"
		assert.deepEqual(
			(await contracts.constraintsInterface.getUserListEntry(accounts[0], 0)).toString(10),
			'1'
		)
	})


	it("can update logic contract only when ConstraintsUpdater", async () => {

		contracts.constraintsLogic = await ConstraintsLogic.new()

		// should fail because is not constraintsUpdater
		await truffleAssert.fails(
			contracts.constraintsProxy.updateLogicContract(contracts.constraintsLogic.address)
		)

		// make constraintsUpdater
		await contracts.adminInterface.add(Role.CONSTRAINTS_UPDATER, constraintsUpdater)

		// now it should pass
		await truffleAssert.passes(
			contracts.constraintsProxy.updateLogicContract(contracts.constraintsLogic.address, {from: constraintsUpdater})
		)

		// The new ConstraintsLogicContract address has been saved to the proxy's storage
		assert.deepEqual(
			await contracts.constraintsProxy.constraintsLogicAddress(),
			contracts.constraintsLogic.address
		)
	})


	it("keeps the storage unaffected by new logic contract", async () => {
		await contracts.constraintsInterface.editUserList(accounts[0], 1, 1, {from: constraintsEditor})

		newConstraintsLogicContract = await NewConstraintsLogicContract.new()

		await contracts.constraintsProxy.updateLogicContract(newConstraintsLogicContract.address, {from: constraintsUpdater})

		assert.deepEqual(
			(await contracts.constraintsInterface.getUserListEntry(accounts[0], 1)).toString(10),
			'1'
		)
	})


	it("new different contract keeps storage and extends functionality", async () => {

		newConstraintsLogicContract = await NewConstraintsLogicContract.new()

		await contracts.constraintsProxy.updateLogicContract(newConstraintsLogicContract.address, {from: constraintsUpdater})


		// add whitelist entries
		await contracts.constraintsInterface.editUserList(accounts[0], 0, 1, {from: constraintsEditor})

		await contracts.constraintsInterface.editUserList(accounts[1], 1, 1, {from: constraintsEditor})

		// should throw because of new 1234 constraint
		await truffleAssert.fails(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)
	})

})
