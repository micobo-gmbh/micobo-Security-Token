const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const { conf } = require("../token-config")

contract("Test default partition behaviour", async (accounts) => {
	let contracts

	let value = 1000

	before(async () => {
		const chainId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[chainId].address),
		}

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(conf.standardPartition, accounts[0], value, "0x0")
	})

	it("can read partitions for accounts", async () => {
		let partitions = await contracts.micoboSecurityToken.partitionsOf(accounts[0])

		assert.deepEqual(partitions, [conf.standardPartition])
	})
})
