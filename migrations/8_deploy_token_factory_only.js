// const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")

module.exports = async (deployer, network, accounts) => {
	if (network == "development" || network == "soliditycoverage" || network == "test") {
		console.log("skipping token factory only")
		return
	}

	try {
		await deployer.deploy(SecurityTokenFactory, "INSERT_SECURITY_TOKEN_ADDRESS")
	} catch (e) {
		console.log(e)
	}
}
