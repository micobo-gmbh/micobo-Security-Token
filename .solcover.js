const fs = require("fs")
const test_mnemonic = fs.readFileSync(".mnemonic").toString().trim()

module.exports = {
	providerOptions: {
		allowUnlimitedContractSize: true,
		mnemonic: test_mnemonic,
	},
	istanbulFolder: "./public/coverage",
	client: require("ganache-cli"),
	// onCompileComplete: serverReadyHandler,
}
