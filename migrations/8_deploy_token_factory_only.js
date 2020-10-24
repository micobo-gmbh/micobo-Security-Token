const SecurityTokenFactory = artifacts.require("SecurityTokenFactory")

module.exports = async (deployer, network, accounts) => {
	if (network == "development") {
		console.log("skipping token factory only")
		return
	}

	try {
		await deployer.deploy(SecurityTokenFactory, "0x0d8879dbdCc14b937B49C6dB8b90Ebb163A49ca2")
	} catch (e) {
		console.log(e)
	}
}
