const {deployAllContracts, Role} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Burning', async (accounts) => {
	let contracts

	let minter = accounts[1]
	let burner = accounts[2]

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts()

	})

	it("burns tokens of test addresses if burner", async () => {

		// make minter
		await contracts.adminInterface.add(Role.MINTER, minter)

		// mint
		await contracts.compliantTokenInterface.mint(accounts[0], 1000, {from: minter})

		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)

		// should fail because is not burner
		await truffleAssert.fails(
			contracts.compliantTokenInterface.destroy(accounts[0], 500, {from:burner})
		)

		// make burner
		await contracts.adminInterface.add(Role.BURNER, burner)

		//should pass now
		await truffleAssert.passes(
			contracts.compliantTokenInterface.destroy(accounts[0], 500, {from:burner})
		)

		// new balance matches
		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			500
		)
	})


	it("cannot burn more than balance", async () => {

		await truffleAssert.passes(
			contracts.compliantTokenInterface.destroy(accounts[0], 400, {from:burner})
		)

		await truffleAssert.fails(
			contracts.compliantTokenInterface.destroy(accounts[0], 200, {from:burner})
		)

		// 1000000000000000
	})

})
