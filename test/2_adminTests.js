/*
	Test admin contract functionality
 */


const truffleAssert = require('truffle-assertions')

const {deployAllContracts, Role} = require('./_deployment.js');


contract('Test Admin Contract', async (accounts) => {

	let contracts

	before(async () => {

		contracts = await deployAllContracts(accounts)

	})

	it("accounts[0] is admin", async () => {

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.ADMIN, accounts[0]),
			true
		)
	})

	it("can add and remove roles", async () => {

		// other admin
		await contracts.adminInterface.addRole(Role.ADMIN, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.ADMIN, accounts[1]),
			true
		)

		await contracts.adminInterface.removeRole(Role.ADMIN, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.ADMIN ,accounts[1]),
			false
		)

		// constraintsEditor
		await contracts.adminInterface.addRole(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.CONSTRAINTS_EDITOR, accounts[1]),
			true
		)

		await contracts.adminInterface.removeRole(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.CONSTRAINTS_EDITOR, accounts[1]),
			false
		)
	})

	it("can renounce role", async () => {

		// constraintsEditor
		await contracts.adminInterface.addRole(Role.CONSTRAINTS_EDITOR, accounts[1])

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.CONSTRAINTS_EDITOR, accounts[1]),
			true
		)

		await contracts.adminInterface.renounceRole(Role.CONSTRAINTS_EDITOR, {from: accounts[1]})

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.CONSTRAINTS_EDITOR, accounts[1]),
			false
		)
	})

	it("cannot renounce role one doesn't have", async () => {
		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.CONSTRAINTS_EDITOR, accounts[1]),
			false
		)

		await truffleAssert.fails(
			contracts.adminInterface.renounceRole(Role.CONSTRAINTS_EDITOR, {from: accounts[1]})
		)
	})

	it("cannot remove own ADMIN role", async () => {
		await truffleAssert.fails(
			contracts.adminInterface.removeRole(Role.ADMIN, accounts[0])
		)

		await truffleAssert.fails(
			contracts.adminInterface.renounceRole(Role.ADMIN)
		)
	})

	it("non-admin cannot add nor remove roles", async () => {

		assert.deepEqual(
			await contracts.adminInterface.hasRole(Role.ADMIN ,accounts[1]),
			false
		)

		// give admin role to oneself
		await truffleAssert.fails(
			contracts.adminInterface.addRole(Role.ADMIN, accounts[1], {from: accounts[1]})
		)

		// remove admin role from other admin
		await truffleAssert.fails(
			contracts.adminInterface.removeRole(Role.ADMIN, accounts[0], {from: accounts[1]})
		)
	})

})
