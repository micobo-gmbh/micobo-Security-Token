const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../build/contracts/SecurityToken.json")
const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")

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

	securityTokenFactory = await deployer.deploy(SecurityTokenFactory, securityToken.address)

	let tx = await securityTokenFactory.deployNewSecurityToken(
		Math.floor(Math.random() * 10 + 1),
		accounts[9], // proxy admin can not use the proxy itself, therefore we use account 9 here
		data
	)

	console.log(tx.logs[0].args.proxy)

	const chainId = await web3.eth.net.getId()

	securityTokenJSON.networks[chainId].address = tx.logs[0].args.proxy

	// use this for testing
	/* if (network == "development") {
		console.log("DEV MIGRATION")

		console.log(accounts[0])

		try {
			let st = await deployer.deploy(
				SecurityToken,
			)
			await st.initialize(
				conf.name, // name
				conf.symbol, // symbol
				conf.granularity, // granularity of 2 for testing
				conf.standardCap, // cap
				accounts[0], // admin
				accounts[7], // controller is account 7 to avoid confusion, because controller disregards constraints
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)
			console.log(st.address)
		} catch (e) {
			throw e
		}
	} else if (network == "test") {
		console.log("TEST MIGRATION")
		try {
			let st = await deployer.deploy(
				SecurityToken,
			)
			await st.initialize(
				conf.name, // name
				conf.symbol, // symbol
				1, // granularity
				conf.standardCap, // cap
				accounts[0], // admin
				accounts[0], // controller
				accounts[0], // issuer
				accounts[0], // redeemer
				accounts[0] // module_editor
			)
		} catch (e) {
			throw e
		}

		// this for everything else
	} else {
		try {
			gnosisMultisigAddress = "0xCf58fD93bd6C6d2802e2Cdf33B37933dAEc024Ea"

			let st = await deployer.deploy(
				SecurityToken,
			)
			await st.initialize(
				conf.name, // name
				conf.symbol, // symbol
				1, // granularity
				1000000, // cap
				gnosisMultisigAddress, // admin
				gnosisMultisigAddress, // controller
				gnosisMultisigAddress, // issuer
				gnosisMultisigAddress, // redeemer
				gnosisMultisigAddress // module_editor
			)
		} catch (e) {
			throw e
		}
	} */
}
