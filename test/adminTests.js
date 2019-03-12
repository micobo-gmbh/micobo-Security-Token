/*
	Test admin contract functionality
 */

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

// TODO redesign tests for new admin func


contract('Test Admin Contract', async (accounts) => {
	let constraintsLogic,
		constraintsProxy,
		constraintsInterface,
		compliantToken,
		compliantTokenInterface,
		adminLogic,
		adminProxy,
		adminInterface

	// deepEqual compares with '==='

	before(async () => {

		// ADMIN
		adminLogic = await AdministrationLogic.new()

		adminProxy = await AdministrationProxy.new(adminLogic.address)

		adminInterface = await AdministrationInterface.at(adminProxy.address)


		// CONSTRAINTS
		constraintsLogic = await ConstraintsLogic.new(adminProxy.address)

		constraintsProxy = await ConstraintsProxy.new(constraintsLogic.address, adminProxy.address)

		constraintsInterface = await ConstraintsInterface.at(constraintsProxy.address)


		// TOKEN
		compliantToken = await CompliantToken.new(
			aos_conf.name,
			aos_conf.symbol,
			aos_conf.decimals,
			aos_conf.cap,
			constraintsProxy.address,
			adminProxy.address)

		compliantTokenInterface = await CompliantTokenInterface.at(compliantToken.address)
	})


	it("adds msg.sender as admin", async () => {

		console.log(accounts[0])

		let r = await adminInterface.isAdmin(accounts[0])
		console.log(r)

		assert.deepEqual(
			await adminInterface.isAdmin(accounts[0]),
			true
		)
	})


	/*
	add and remove roles (only admin)
	roles can be renounced by their bearers
	see if roles have been added successfully
	only pauser can pause contract
	only updaters can update logic (2)
	only minter can mint tokens
	 */

	/*
	i can update the admin contract and data will not be lost
	show update schemes where a new role is introduced
	i can update admin logic without compromising other contracts security!!!
	 */


})
