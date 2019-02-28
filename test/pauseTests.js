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

		await compliantTokenInterface.mint(accounts[0], 1000);
	})

	it("confirms that deployer is owner", async () => {

		assert.deepEqual(
			await compliantTokenInterface.isPauser(accounts[0]),
			true
		)

	})


	// PAUSING UND UNPAUSING

	it("can pause and unpause contract", async () => {

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			false
		)

		await compliantTokenInterface.pause();

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			true
		)

		await compliantTokenInterface.unpause();

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			false
		)

	})

	it("cannot pause contract if not Pauser", async () => {

		assert.deepEqual(
			await compliantTokenInterface.isPauser(accounts[1]),
			false
		)

		await truffleAssert.fails(
			compliantTokenInterface.pause({
				from: accounts[1]
			})
		)

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			false
		)

	})

	it("cannot unpause contract if unpaused and vice versa", async () => {

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			false
		)

		await truffleAssert.fails(
			compliantTokenInterface.unpause()
		)

		await compliantTokenInterface.pause();

		assert.deepEqual(
			await compliantTokenInterface.paused(),
			true
		)

		await truffleAssert.fails(
			compliantTokenInterface.pause()
		)

		await compliantTokenInterface.unpause()

	})


	// LIMITS WHEN PAUSED

	it("cannot transfer tokens if paused", async () => {

		await compliantTokenInterface.pause();

		// add whitelist entries so it will not fail because of that
		await constraintsInterface.editUserList(accounts[0], 0, 1)

		await constraintsInterface.editUserList(accounts[1], 1, 1)

		await truffleAssert.fails(
			compliantTokenInterface.transfer(accounts[1], 5)
		)

		await compliantTokenInterface.approve(accounts[1], 5)

		await truffleAssert.fails(
			compliantTokenInterface.transferFrom(accounts[0], accounts[1], 5, {
				from: accounts[1]
			})
		)

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			1000
		)

		// reset
		await compliantTokenInterface.unpause()

	})


	// PAUSER ADMINISTRATION

	it("can add Pauser and renounce Pauser", async () => {

		assert.deepEqual(
			await compliantTokenInterface.isPauser(accounts[1]),
			false
		)

		await compliantTokenInterface.addPauser(accounts[1])

		assert.deepEqual(
			await compliantTokenInterface.isPauser(accounts[1]),
			true
		)

		await compliantTokenInterface.renouncePauser({
			from: accounts[1]
		})

		assert.deepEqual(
			await compliantTokenInterface.isPauser(accounts[1]),
			false
		)

	})

})
