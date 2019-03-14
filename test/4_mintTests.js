const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')

const {deployAllContracts, Role} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Minting', async (accounts) => {
	let contracts

	let minter = accounts[1]

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts()

	})

	it("mints tokens to test addresses if minter", async () => {

		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			0
		)

		// should fail because is not minter
		await truffleAssert.fails(
			contracts.compliantTokenInterface.mint(accounts[0], 1000, {from: minter})
		)

		// make minter
		await contracts.adminInterface.add(Role.MINTER, minter)

		// now it should pass
		await truffleAssert.passes(
			contracts.compliantTokenInterface.mint(accounts[0], 1000, {from: minter})
		)

		assert.deepEqual(
			(await contracts.compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)

	})


	it("cannot mint more than cap", async () => {


		await truffleAssert.passes(
			contracts.compliantTokenInterface.mint(accounts[0], 1000, {from: minter})
		)

		await truffleAssert.fails(
			contracts.compliantTokenInterface.mint(accounts[0], 1000000000000001, {from: minter})
		)

		// 1000000000000000
	})

})
