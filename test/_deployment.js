/*
	Test if all contracts can be deployed and are linked correctly
 */

const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')

contract('Test Deployment', async (accounts) => {
	let constraintsLogic, constraintsProxy


	// deepEqual compares with '==='

	it("deploys constraints logic", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new()
		})
	})

	it("deploys constraints proxy", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new()
			constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address)
		})
	})

	it("proxy saves correct logic address", async () => {
		constraintsLogic = await ConstraintsLogic.new()
		constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address)

		assert.deepEqual(
			await constraintsProxy.constraintsLogicContract(),
			constraintsLogic.address
		)
	})

	it("deploys a token contract", async () => {

		aosToken = await CompliantToken.new(constraintsProxy.address, 1000000000)

		aosTokenInterface = await CompliantTokenInterface.at(aosToken.address)

		assert.deepEqual(
			(await CompliantTokenInterface.name()).toString(10),
			'AOS Token'
		)
	})

	// TODO add other contracts

})