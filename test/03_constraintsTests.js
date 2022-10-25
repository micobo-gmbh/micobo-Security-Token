const { Role } = require("./Constants")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")

const truffleAssert = require("truffle-assertions")
const { conf } = require("../token-config")

contract("Test Constraint Contract", async (accounts) => {
	let contracts

	let moduleAddresses = ["0x024269E2057b904d1Fa6a7B52056A8580a85180F"]

	// deepEqual compares with '==='

	before(async () => {
		const networkId = await web3.eth.net.getId()

		contracts = {
			micoboSecurityToken: await SecurityToken.at(securityTokenJSON.networks[networkId].address),
		}
	})

	it("can set modules only when constraints editor", async () => {
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, moduleAddresses)
		)

		// remove constraintEditor
		await contracts.micoboSecurityToken.removeRole(Role.MODULE_EDITOR, accounts[0])

		await truffleAssert.fails(
			contracts.micoboSecurityToken.setModulesByPartition(conf.standardPartition, moduleAddresses)
		)

		assert.deepEqual(
			await contracts.micoboSecurityToken.getModulesByPartition(conf.standardPartition),
			moduleAddresses
		)
	})
})
