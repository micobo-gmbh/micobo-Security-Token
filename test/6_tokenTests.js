const truffleAssert = require('truffle-assertions')

const aos_conf = require('../AOS-config')

const {deployAllContracts, Role} = require('./_deployment.js');


contract('Test Compliant Token', async (accounts) => {

	let contracts

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts()

		// make me minter
		await contracts.adminInterface.add(Role.MINTER, accounts[0])

		// mint some new tokens to test with
		await contracts.compliantTokenInterface.mint(accounts[0], 1000);
		await contracts.compliantTokenInterface.mint(accounts[1], 1000);
	})

	it("gives me all the correct token informations", async () => {

		assert.deepEqual((await contracts.compliantTokenInterface.name.call()), aos_conf.name)

		assert.deepEqual((await contracts.compliantTokenInterface.symbol()), aos_conf.symbol)

		assert.deepEqual((await contracts.compliantTokenInterface.decimals()).toNumber(), aos_conf.decimals)

		assert.deepEqual((await contracts.compliantTokenInterface.cap()).toNumber(), aos_conf.cap)

		assert.deepEqual((await contracts.compliantTokenInterface.totalSupply()).toNumber(), 2000)

	})


	it("cannot send token if account is not whitelisted", async () => {

		// TODO get the error messages thrown by require --> geth doesn't provide reason

		await truffleAssert.fails(
			contracts.compliantTokenInterface.transfer(accounts[1], 5)
		)
	})


	it("can send tokens from and to authorized addresses", async () => {

		let constraintsEditor = accounts[1]

		// make constraintsUpdater
		await contracts.adminInterface.add(Role.CONSTRAINTS_EDITOR, constraintsEditor)

		// add whitelist entries
		await contracts.constraintsInterface.editUserList(accounts[0], 0, 1, {from: constraintsEditor})

		await contracts.constraintsInterface.editUserList(accounts[1], 1, 1, {from: constraintsEditor})

		await contracts.compliantTokenInterface.transfer(accounts[1], 5)

		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[1])).toNumber(),
			1005
		)

		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			995
		)

	})

})
