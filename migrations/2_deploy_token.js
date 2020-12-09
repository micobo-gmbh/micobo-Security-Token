const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")
const securityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")

const { conf } = require("../token-config")

const ERC1820 = require("erc1820")

module.exports = async (deployer, network, accounts) => {
	await ERC1820.deploy(web3, accounts[0])

	let securityToken, securityTokenFactory

	let micoboSecurityToken = new web3.eth.Contract(securityTokenJSON.abi)

	// encode ABI for init function (former constructor)
	let data = micoboSecurityToken.methods
		.initialize(
			conf.name,
			conf.symbol,
			conf.granularity,
			conf.standardCap,
			accounts[0],
			accounts[7],
			accounts[0],
			accounts[0],
			accounts[0]
		)
		.encodeABI()

	securityToken = await deployer.deploy(SecurityToken)

	securityTokenFactory = new web3.eth.Contract(securityTokenFactoryJSON.abi)

	// securityTokenFactory = await deployer.deploy(SecurityTokenFactory, securityToken.address)

	const newSecurityTokenFactory = await securityTokenFactory
		.deploy({
			data: securityTokenFactoryJSON.bytecode,
			arguments: [securityToken.address],
		})
		.send({
			from: accounts[0],
			gas: 6000000,
		})

	let receipt = await newSecurityTokenFactory.methods
		.deployNewSecurityToken(
			Math.floor(Math.random() * 10 + 1),
			accounts[9], // proxy admin can not use the proxy itself, therefore we use account 9 here
			data
		)
		.send({
			from: accounts[0],
			gas: 6000000,
		})

	console.log(receipt.events.ProxyCreated.returnValues.proxy)

	const chainId = await web3.eth.net.getId()
	try {
		// remember proxy contract address for testing
		if (!securityTokenJSON.networks[chainId]) {
			console.log("chainId undefined. Setting to", chainId)
			securityTokenJSON.networks[chainId] = {}
			// console.log(securityTokenJSON.networks[chainId])

			securityTokenJSON.networks[chainId].address = receipt.events.ProxyCreated.returnValues.proxy
		} else {
			securityTokenJSON.networks[chainId].address = receipt.events.ProxyCreated.returnValues.proxy
		}

		// remember factory contract address for testing
		if (!securityTokenFactoryJSON.networks[chainId]) {
			console.log("chainId undefined. Setting to", chainId)
			securityTokenFactoryJSON.networks[chainId] = {}
			// console.log(securityTokenJSON.networks[chainId])

			securityTokenFactoryJSON.networks[chainId].address = newSecurityTokenFactory.address
		} else {
			securityTokenFactoryJSON.networks[chainId].address = newSecurityTokenFactory
		}
	} catch (e) {
		console.error(e)
	}
}
