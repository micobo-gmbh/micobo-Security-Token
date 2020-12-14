const truffleAssert = require("truffle-assertions")
const SecurityToken = artifacts.require("SecurityToken")
const BaseAdminUpgradeabilityProxy = artifacts.require("BaseAdminUpgradeabilityProxy")
const NewSecurityToken = artifacts.require("NewSecurityToken")
const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")

contract("Test Proxy and Upgradeability", async (accounts) => {
	let contracts

	before(async () => {
		const chainId = await web3.eth.net.getId()

		let proxyAddress = securityTokenJSON.networks[chainId].address
		console.log("proxy address", proxyAddress)

		contracts = {
			securityTokenProxy: await SecurityToken.at(proxyAddress),
			proxyInterface: await BaseAdminUpgradeabilityProxy.at(proxyAddress),
			securityTokenFactory: await SecurityTokenFactory.deployed(),
			securityToken: await SecurityToken.deployed(),
			newSecurityToken: await NewSecurityToken.new(),
		}
	})

	it("can get current version", async () => {
		let version = await contracts.securityTokenProxy.version()
		console.log("version:", version)

		assert.deepEqual(version, "1.0.0")
	})

	it("update implementation in factory", async () => {
		// fails if not admin
		await truffleAssert.fails(
			contracts.securityTokenFactory.updateImplementation(contracts.newSecurityToken.address, {
				from: accounts[1],
			}),
			truffleAssert.ErrorType.REVERT
		)

		// address 0 deployed the factory, it is the owner and can change the impl
		await truffleAssert.passes(
			contracts.securityTokenFactory.updateImplementation(contracts.newSecurityToken.address)
		)

		// impl changed
		assert.deepEqual(
			await contracts.securityTokenFactory.implementationContract(),
			contracts.newSecurityToken.address
		)
	})

	it("can upgrade proxy", async () => {
		// fails if not proxy admin
		await truffleAssert.fails(
			contracts.proxyInterface.upgradeTo(contracts.newSecurityToken.address),
			truffleAssert.ErrorType.REVERT
		)

		// address 0 deployed the factory, it is the owner and can change the impl
		await truffleAssert.passes(
			contracts.proxyInterface.upgradeTo(contracts.newSecurityToken.address, {
				from: accounts[9],
			})
		)

		let version = await contracts.securityTokenProxy.version()
		console.log("version:", version)

		assert.deepEqual(version, "2.0.0")
	})
})
