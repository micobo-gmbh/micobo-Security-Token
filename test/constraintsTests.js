/*
	Test constraint contract functionality and updatability
 */

const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const NewConstraintsLogicContract = artifacts.require('NewConstraintsLogicContract')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')


const truffleAssert = require('truffle-assertions')

const aos_conf = require('../AOS-config')

// TODO redesign tests for new admin func


contract('Test Constraint Contract', async (accounts) => {
	let constraintsLogic, constraintsProxy, constraintsInterface, newConstraintsLogicContract, compliantToken, compliantTokenInterface

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
			aos_conf.cap,
			constraintsProxy.address)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)
	})


	it("can edit and get userList entries", async () => {

		await constraintsInterface.editUserList(accounts[0], 0, 1)

		// The proxy's UserList entry "0" is "1", after being changed by the logic lib using "delegatecall"
		assert.deepEqual(
			(await constraintsInterface.getUserListEntry(accounts[0], 0)).toString(10),
			'1'
		)
	})

	it("can update logic contract", async () => {
		constraintsLogic = await ConstraintsLogic.new()

		await constraintsProxy.updateLogicContract(constraintsLogic.address)

		// The new ConstraintsLogicContract address has been saved to the proxy's storage
		assert.deepEqual(
			await constraintsProxy.constraintsLogicContract(),
			constraintsLogic.address
		)
	})

	it("keeps the storage unaffected by new logic contract", async () => {
		await constraintsInterface.editUserList(accounts[0], 1, 1)

		newConstraintsLogicContract = await NewConstraintsLogicContract.new()

		await constraintsProxy.updateLogicContract(newConstraintsLogicContract.address)

		assert.deepEqual(
			(await constraintsInterface.getUserListEntry(accounts[0], 1)).toString(10),
			'1'
		)
	})

	it("new different contract keeps storage and extends functionality", async () => {

		newConstraintsLogicContract = await NewConstraintsLogicContract.new()

		await constraintsProxy.updateLogicContract(newConstraintsLogicContract.address)


		// add whitelist entries
		await constraintsInterface.editUserList(accounts[0], 0, 1)

		await constraintsInterface.editUserList(accounts[1], 1, 1)

		// should throw because of new 1234 constraint
		await truffleAssert.fails(
			compliantTokenInterface.transfer(accounts[1], 5)
		)
	})

})
