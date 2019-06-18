/*
	Test admin contract functionality
 */
const NewAdministrationLogic = artifacts.require('NewAdministrationLogic')
const NewAdministrationInterface = artifacts.require('NewAdministrationInterface')


const truffleAssert = require('truffle-assertions')

const {deployAllContracts, Role} = require('./_deployment.js');


contract('Test Admin Contract', async (accounts) => {

	let contracts, newAdministrationLogic, newAdministrationInterface

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts(accounts[0])

	})


	it("msg.sender (contract deployer) is admin", async () => {

		assert.deepEqual(
			await contracts.adminInterface.isAdmin(accounts[0]),
			true
		)
	})


	it("can add and remove roles", async () => {

		// other admin
		await contracts.adminInterface.add(Role.ADMIN, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.isAdmin(accounts[1]),
			true
		)

		await contracts.adminInterface.remove(Role.ADMIN, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.isAdmin(accounts[1]),
			false
		)

		// constraintsEditor
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			true
		)

		await contracts.adminInterface.remove(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			false
		)

	})

	it("cannot remove own ADMIN role", async () => {
		await truffleAssert.fails(
			contracts.adminInterface.remove(Role.ADMIN, accounts[0])
		)

		await truffleAssert.fails(
			contracts.adminInterface.renounce(Role.ADMIN)
		)
	})


	it("non-admin cannot add nor remove roles", async () => {

		// other admin
		await truffleAssert.fails(
			contracts.adminInterface.add(Role.ADMIN, accounts[1], {from: accounts[1]})
		)

		assert.deepEqual(
			await contracts.adminInterface.isAdmin(accounts[1]),
			false
		)

		await truffleAssert.fails(
			contracts.adminInterface.remove(Role.ADMIN, accounts[1], {from: accounts[1]})
		)

		assert.deepEqual(
			await contracts.adminInterface.isAdmin(accounts[1]),
			false
		)


		// constraintsEditor
		await truffleAssert.fails(
			contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, accounts[1], {from: accounts[1]})
		)

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			false
		)

		await truffleAssert.fails(
			contracts.adminInterface.remove(Role.CONSTRAINTS_EDITOR, accounts[1], {from: accounts[1]})
		)

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			false
		)
	})


	it("roles can be renounced only by bearers", async () => {

		// add another admin
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			true
		)

		// should fail because account 0 is not ConstraintsEditor
		await truffleAssert.fails(
			contracts.adminInterface.renounce(Role.CONSTRAINTS_EDITOR)
		)

		await contracts.adminInterface.renounce(Role.CONSTRAINTS_EDITOR, {from: accounts[1]})

		assert.deepEqual(
			await contracts.adminInterface.isConstraintsEditor(accounts[1]),
			false
		)
	})


	it("allows adminLogic update if adminUpdater", async () => {

		let adminUpdater = accounts[2]

		// make adminUpdater
		await contracts.adminInterface.add(Role.ADMIN_UPDATER, adminUpdater)

		newAdministrationLogic = await NewAdministrationLogic.new()

		// default account cannot update
		await truffleAssert.fails(
			contracts.adminMaster.updateLogicContract(newAdministrationLogic.address)
		)

		// it should pass when using adminUpdater
		await truffleAssert.passes(
			contracts.adminMaster.updateLogicContract(newAdministrationLogic.address, {from: adminUpdater})
		)

		// load new interface
		newAdministrationInterface = await NewAdministrationInterface.at(contracts.adminMaster.address)

		// see if we can use new Role
		await truffleAssert.passes(
			newAdministrationInterface.add(Role.SOME_NEW_ROLE, accounts[0])
		)

		assert.deepEqual(
			await newAdministrationInterface.isSomeNewRole(accounts[0]),
			true
		)
	})

})
