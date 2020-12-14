const truffleAssert = require("truffle-assertions")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { conf } = require("../token-config")
const { Role } = require("./Constants")

contract("Test Off-Chain Validation", async (accounts) => {
	// TODO

	let contracts

	// deepEqual compares with '==='

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}
	})
})
