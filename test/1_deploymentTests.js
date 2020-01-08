/*
	Test if all contracts can be deployed
 */

const ERC1400ERC20 = artifacts.require('ERC1400ERC20')
const ISecurityToken = artifacts.require('ISecurityToken')
const SecurityTokenPartition = artifacts.require('SecurityTokenPartition')


const conf = require('../token-config');

const deployAllContracts = require('./_deployment.js').deployAllContracts;


contract('Test Deployment', async (accounts) => {
	let constraintsLogic, constraintsMaster, constraintsInterface, compliantToken, compliantTokenInterface, adminLogic,
		adminMaster, adminInterface


	// deepEqual compares with '==='

	it("deploy an admin contract and master", async () => {
		adminLogic = await AdministrationLogic.new()

		adminMaster = await AdministrationMaster.new(adminLogic.address, accounts[0])

		adminInterface = await AdministrationInterface.at(adminMaster.address)

		assert.deepEqual(
			await adminMaster.administrationLogicAddress(),
			adminLogic.address
		)
	})

	it("deploys constraints logic", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new(adminMaster.address)
		})
	})

	it("deploys constraints master", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new(adminMaster.address)
			constraintsMaster = await ConstraintsMaster.new(constraintsLogic.address, adminMaster.address)
		})
	})

	it("master saves correct logic address", async () => {
		constraintsLogic = await ConstraintsLogic.new(adminMaster.address)

		constraintsMaster = await ConstraintsMaster.new(constraintsLogic.address, adminMaster.address)

		constraintsInterface = await ConstraintsInterface.at(constraintsMaster.address)

		assert.deepEqual(
			await constraintsMaster.constraintsLogicAddress(),
			constraintsLogic.address
		)
	})

	it("deploys a token contract", async () => {

		compliantToken = await CompliantToken.new(
			conf.name,
			conf.symbol,
			conf.decimals,
			conf.cap,
			constraintsMaster.address,
			adminMaster.address)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

		assert.deepEqual(
			(await compliantTokenInterface.name()).toString(10),
			conf.name
		)
	})

	// test this function to know it will work for all the other test cases
	it("successfully deploys all contracts in a row", async () => {
		await deployAllContracts(accounts[0])
	})

})
