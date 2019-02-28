/*
	Test constraint contract functionality and updatability
 */

const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')

contract('Test Proxies', async (accounts) => {
	let constraintsLogic, constraintsProxy, constraintsInterface

	// deepEqual compares with '==='

	before(async () => {
		constraintsLogic = await ConstraintsLogic.new()
		console.log('logic address:', constraintsLogic.address);

		constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address)
		console.log('proxy address', constraintsProxy.address);

		// pretend proxy is logic
		constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)
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

		console.log('new logic address: ', constraintsLogic.address)

		await constraintsProxy.updateLogicContract(constraintsLogic.address)

		// The new ConstraintsLogicContract address has been saved to the proxy's storage
		assert.deepEqual(
			await constraintsProxy.constraintsLogicContract(),
			constraintsLogic.address
		)
	})

	it("keeps the storage unaffected by new logic contract", async () => {
		await constraintsInterface.editUserList(accounts[0], 1, 1)

		constraintsLogic = await ConstraintsLogic.new()

		console.log('new logic address: ', constraintsLogic.address)

		await constraintsProxy.updateLogicContract(constraintsLogic.address)

		assert.deepEqual(
			(await constraintsInterface.getUserListEntry(accounts[0], 1)).toString(10),
			'1'
		)
	})

})
