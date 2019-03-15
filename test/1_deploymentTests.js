/*
	Test if all contracts can be deployed and are linked correctly
 */

const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsMaster = artifacts.require('ConstraintsMaster')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const CompliantToken = artifacts.require('CompliantToken')
const CompliantTokenInterface = artifacts.require('CompliantTokenInterface')
const AdministrationInterface = artifacts.require('AdministrationInterface')
const AdministrationLogic = artifacts.require('AdministrationLogic')
const AdministrationMaster = artifacts.require('AdministrationMaster')


const aos_conf = require('../AOS-config');

const deployAllContracts = require('./_deployment.js').deployAllContracts;


contract('Test Deployment', async (accounts) => {
	let constraintsLogic, constraintsProxy, constraintsInterface, compliantToken, compliantTokenInterface, adminLogic,
		adminProxy, adminInterface


	// deepEqual compares with '==='

	it("deploy an admin contract and master", async () => {
		adminLogic = await AdministrationLogic.new()

		adminProxy = await AdministrationMaster.new(adminLogic.address)

		adminInterface = await AdministrationInterface.at(adminProxy.address)

		assert.deepEqual(
			await adminProxy.administrationLogicAddress(),
			adminLogic.address
		)
	})

	it("deploys constraints logic", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new(adminProxy.address)
		})
	})

	it("deploys constraints master", async () => {
		await assert.doesNotThrow(async () => {
			constraintsLogic = await ConstraintsLogic.new(adminProxy.address)
			constraintsProxy = await ConstraintsMaster.new(constraintsLogic.address, adminProxy.address)
		})
	})

	it("master saves correct logic address", async () => {
		constraintsLogic = await ConstraintsLogic.new(adminProxy.address)

		constraintsProxy = await ConstraintsMaster.new(constraintsLogic.address, adminProxy.address)

		constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)

		assert.deepEqual(
			await constraintsProxy.constraintsLogicAddress(),
			constraintsLogic.address
		)
	})

	it("deploys a token contract", async () => {

		compliantToken = await CompliantToken.new(
			aos_conf.name,
			aos_conf.symbol,
			aos_conf.decimals,
			aos_conf.cap,
			constraintsProxy.address,
			adminProxy.address)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)

		assert.deepEqual(
			(await compliantTokenInterface.name()).toString(10),
			aos_conf.name
		)
	})

	// test this function to know it will work for all the other test cases
	it("successfully deploys all contracts in a row", async () => {
		await deployAllContracts()
	})

})