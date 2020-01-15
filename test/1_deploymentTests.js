/*
	Test if all contracts can be deployed
 */

const Admin = artifacts.require('Admin')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const conf = require('../token-config');


contract('Test Deployment', async (accounts) => {

	let micoboSecurityToken, admin

	// deepEqual compares with '==='

	it("deploys admin contract", async () => {
		admin = await Admin.new(
			conf.admins,
			conf.controllers
		)
	})

	it("deploy micobo security token", async () => {
		micoboSecurityToken = await MicoboSecurityToken.new(
			conf.name,
			conf.symbol,
			conf.granularity,
			admin.address
		)
	})

})
