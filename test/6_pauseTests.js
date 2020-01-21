const {deployAllContracts, Role, Code} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Pausing', async (accounts) => {

	// TODO

	let contracts

	let pauser = accounts[2]
	let constraintsEditor = accounts[1]

	// deepEqual compares with '==='

	before(async () => {
		contracts = await deployAllContracts(accounts)

		// make pauser
		await contracts.adminInterface.add(Role.PAUSER, pauser)
	})

	it("confirms that pauserAddress has been added as Pauser", async () => {

		assert.deepEqual(
			await contracts.adminInterface.isPauser(pauser),
			true
		)

	})


	// PAUSING UND UNPAUSING

	it("pauser can pause and unpause contract", async () => {

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			false
		)

		await contracts.compliantTokenInterface.pause({from: pauser});

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			true
		)

		await contracts.compliantTokenInterface.unpause({from: pauser});

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			false
		)

	})

	it("cannot pause contract if not Pauser", async () => {

		assert.deepEqual(
			await contracts.adminInterface.isPauser(accounts[0]),
			false
		)

		await truffleAssert.fails(
			contracts.compliantTokenInterface.pause()
		)

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			false
		)

	})

	it("cannot unpause contract if unpaused and vice versa", async () => {

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			false
		)

		await truffleAssert.fails(
			contracts.compliantTokenInterface.unpause({from: pauser})
		)

		await contracts.compliantTokenInterface.pause({from: pauser});

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			true
		)

		await truffleAssert.fails(
			contracts.compliantTokenInterface.pause({from: pauser})
		)

		await contracts.compliantTokenInterface.unpause({from: pauser})

	})


	// LIMITS WHEN PAUSED

	it("cannot transfer tokens if paused", async () => {

		assert.deepEqual(
			await contracts.compliantTokenInterface.paused(),
			false
		)

		// make me minter
		await contracts.adminInterface.add(Role.MINTER, accounts[0])

		// mint tokens for me, transferring should later fail because of paused contract not insufficient funds
		await contracts.compliantTokenInterface.mint(accounts[0], 1000);


		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)


		// make constraintsEditor
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, constraintsEditor)

		// add whitelist entries so it will not fail because of that
		await contracts.constraintsInterface.editUserList(accounts[0], Code.SEND, 1, {from: constraintsEditor})

		await contracts.constraintsInterface.editUserList(accounts[1], Code.RECEIVE, 1, {from: constraintsEditor})


		// pause it
		await contracts.compliantTokenInterface.pause({from: pauser});


		// normal tranfer fails
		await truffleAssert.fails(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)

		await contracts.compliantTokenInterface.approve(accounts[1], 5)

		// transferFrom called from a different account also fails
		await truffleAssert.fails(
			contracts.compliantTokenInterface.transferFrom(accounts[0], accounts[1], 5, {
				from: accounts[1]
			})
		)

		// balance should still be the same
		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)

		// reset
		await contracts.compliantTokenInterface.unpause({from: pauser})

	})


	// PAUSER ADMINISTRATION

	it("can renounce Pauser", async () => {

		assert.deepEqual(
			await contracts.adminInterface.isPauser(pauser),
			true
		)

		await contracts.adminInterface.renounce(Role.PAUSER, {from: pauser})

		assert.deepEqual(
			await contracts.adminInterface.isPauser(pauser),
			false
		)

	})

})
