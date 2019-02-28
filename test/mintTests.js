const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')


const truffleAssert = require('truffle-assertions')

const aos_conf = require('../AOS-config');


contract('Test Pausing', async (accounts) => {
	let constraintsLogic, constraintsProxy, constraintsInterface, compliantToken, compliantTokenInterface


	// deepEqual compares with '==='

	before(async () => {
		constraintsLogic = await ConstraintsLogic.new()

		constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address)

		// pretend proxy is logic
		constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)

		compliantToken = await CompliantToken.new(
			aos_conf.name,
			aos_conf.symbol,
			aos_conf.decimals,
			constraintsProxy.address,
			aos_conf.cap)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

	})

	it("mints tokens to test addresses", async () => {

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			0
		)

		await compliantTokenInterface.mint(accounts[0], 1000);

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)


		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[1])).toNumber(),
			0
		)

		await compliantTokenInterface.mint(accounts[1], 1000);

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[1])).toNumber(),
			1000
		)
	})

})
