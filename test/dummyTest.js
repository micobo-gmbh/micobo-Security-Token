/**
const DummyMaster = artifacts.require('DummyMaster')
const Dummy = artifacts.require('Dummy')
const DummyInterface = artifacts.require('DummyInterface')

contract('Test Proxies', async () => {
	let dummyMaster, dummy
	before(async () => {
		dummyMaster = await DummyMaster.new()
	})

	it("Deploys a proxy", async () => {
		dummy = await Dummy.new(dummyMaster.address)
		dummy = await DummyInterface.at(dummy.address)
		await dummy.increment()
		assert.equal((await dummy.get()).toString(10), '1')
	})

	it("Deploys another proxy", async () => {
		dummy = await Dummy.new(dummyMaster.address)
		dummy = await DummyInterface.at(dummy.address)
		await dummy.increment()
		assert.equal((await dummy.get()).toString(10), '1')
	})

	it("Deploys a third proxy", async () => {
		dummy = await Dummy.new(dummyMaster.address)
		dummy = await DummyInterface.at(dummy.address)
		await dummy.increment()
		assert.equal((await dummy.get()).toString(10), '1')
	})
})

*/