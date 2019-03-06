const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')
const AdministrationInterface = artifacts.require('AdministrationInterface')
const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationProxy = artifacts.require('AdministrationProxy')


const truffleAssert = require('truffle-assertions')

const aos_conf = require('../AOS-config')


contract('Test Compliant Token', async (accounts) => {
	let constraintsLogic, constraintsProxy, constraintsInterface, compliantToken, compliantTokenInterface, adminLogic, adminProxy, adminInterface

	// deepEqual compares with '==='

	before(async () => {

		// deploy constraints contracts
		constraintsLogic = await ConstraintsLogic.new()

		constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address)

		constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)


		// deploy admin contracts
		adminLogic = await AdministrationLogic.new()

		adminProxy = await AdministrationProxy.new(adminLogic.address)

		adminInterface = await AdministrationInterface.at(adminProxy.address)


		// deploy token contracts
		compliantToken = await CompliantToken.new(
			aos_conf.name,
			aos_conf.symbol,
			aos_conf.decimals,
			aos_conf.cap,
			constraintsProxy.address,
			adminProxy.address)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

		// TODO fails right now because of new minting conditions (admin...)
		await compliantTokenInterface.mint(accounts[0], 1000);
		await compliantTokenInterface.mint(accounts[1], 1000);

	})

	it("gives me all the correct token informations", async () => {

		assert.deepEqual((await compliantTokenInterface.name.call()), aos_conf.name)

		assert.deepEqual((await compliantTokenInterface.symbol()), aos_conf.symbol)

		assert.deepEqual((await compliantTokenInterface.decimals()).toNumber(), aos_conf.decimals)

		assert.deepEqual((await compliantTokenInterface.cap()).toNumber(), aos_conf.cap)

		assert.deepEqual((await compliantTokenInterface.totalSupply()).toNumber(), 2000)

		// TODO replace with admin contract
		// assert.deepEqual((await compliantTokenInterface.isMinter(accounts[0])), true)

		// TODO replace with admin contract
		// assert.deepEqual((await compliantTokenInterface.isPauser(accounts[0])), true)

	})


	it("cannot send token if account is not whitelisted", async () => {

		// TODO get the error messages thrown by require

		await truffleAssert.fails(
			compliantTokenInterface.transfer(accounts[1], 5)
		)
	})


	it("can send tokens from and to authorized addresses", async () => {

		// add whitelist entries
		await constraintsInterface.editUserList(accounts[0], 0, 1)

		await constraintsInterface.editUserList(accounts[1], 1, 1)

		await compliantTokenInterface.transfer(accounts[1], 5)

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[1])).toNumber(),
			1005
		)

		assert.deepEqual(
			(await compliantTokenInterface.balanceOf(accounts[0])).toNumber(),
			995
		)

	})

})
