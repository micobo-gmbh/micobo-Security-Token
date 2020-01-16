/*
	Test constraint contract functionality and updatability
 */


const {deployAllContracts, Role, Code} = require('./_deployment.js');

const truffleAssert = require('truffle-assertions')


contract('Test Constraint Contract', async (accounts) => {

	// TODO

	let contracts

	let modules = ['0x024269E2057b904d1Fa6a7B52056A8580a85180F']

	// deepEqual compares with '==='

	before(async () => {

		contracts = await deployAllContracts(accounts)

		// add constraintEditor
		await contracts.adminInterface.addRole(Role.CONSTRAINTS_EDITOR, accounts[0])
	})


	it("can set modules", async () => {

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModules(modules)
		)

		assert.deepEqual(
			await contracts.micoboSecurityToken.modules(),
			modules
		)
	})

})
