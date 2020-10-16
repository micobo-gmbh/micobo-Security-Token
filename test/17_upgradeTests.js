const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { conf } = require("../token-config")

contract("Test default partition behaviour", async (accounts) => {
	let contracts

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}
	})

	it("update implementation", async () => {
		// TODO
	})

	it("upgrade proxy", async () => {
		// TODO
	})

	// etc
})
