const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require("SecurityToken");

const { conf } = require('../token-config')
const { Role } = require('./Roles')

contract('Test Off-Chain Validation', async (accounts) => {
	// TODO

	let contracts

	// deepEqual compares with '==='

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}
	})
})
