const truffleAssert = require('truffle-assertions')

const token_conf = require('../token-config')

const {deployAllContracts, Role, Code} = require('./_deployment.js');


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

		assert.deepEqual((await contracts.compliantTokenInterface.name.call()), token_conf.name)

		assert.deepEqual((await contracts.compliantTokenInterface.symbol()), token_conf.symbol)

		assert.deepEqual((await contracts.compliantTokenInterface.decimals()).toNumber(), token_conf.decimals)

		assert.deepEqual((await contracts.compliantTokenInterface.cap()).toNumber(), token_conf.cap)

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
		await contracts.constraintsInterface.editUserList(accounts[0], Code.SEND, 1, {from: constraintsEditor})

		await contracts.constraintsInterface.editUserList(accounts[1], Code.RECEIVE, 1, {from: constraintsEditor})

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
