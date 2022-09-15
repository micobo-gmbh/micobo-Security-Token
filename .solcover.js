module.exports = {
	providerOptions: {
		allowUnlimitedContractSize: true,
	},
	client: require('ganache-cli'),
	// onCompileComplete: serverReadyHandler,
}
