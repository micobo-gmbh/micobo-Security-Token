/*
	Test if all contracts can be deployed and are linked correctly
 */

const ConstraintsLogic = artifacts.require('ConstraintsLogic')
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
	let constraintsLogic, constraintsMaster, constraintsInterface, compliantToken, compliantTokenInterface, adminLogic,
		adminMaster, adminInterface


	// deepEqual compares with '==='

	it("deploy an admin contract and master", async () => {
		adminLogic = await AdministrationLogic.new()

		adminMaster = await AdministrationMaster.new(adminLogic.address)

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
			aos_conf.name,
			aos_conf.symbol,
			aos_conf.decimals,
			aos_conf.cap,
			constraintsMaster.address,
			adminMaster.address)

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