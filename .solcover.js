const fs = require("fs")
const test_mnemonic = fs.readFileSync(".mnemonic").toString().trim()

module.exports = {
	providerOptions: {
		allowUnlimitedContractSize: true,
		mnemonic: test_mnemonic,
	},
	client: require("ganache-cli"),
	// onCompileComplete: serverReadyHandler,
}
