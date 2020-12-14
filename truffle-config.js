const HDWalletProvider = require("@truffle/hdwallet-provider")
const PrivateKeyProvider = require("truffle-privatekey-provider")

const { GSNProvider } = require("@openzeppelin/gsn-provider")

require("dotenv").config()

// const infuraKey = "fj4jll3k.....";

const fs = require("fs")
const mnemonic = fs.readFileSync(".mnemonic").toString().trim()

module.exports = {
	/**
	 * Networks define how you connect to your ethereum client and let you set the
	 * defaults web3 uses to send transactions. If you don't specify one truffle
	 * will spin up a development blockchain for you on port 9545 when you
	 * run `develop` or `test`. You can ask a truffle command to use a specific
	 * network from the command line, e.g
	 *
	 * $ truffle test --network <network-name>
	 */

	contracts_directory: "./contracts",

	networks: {
		// Useful for testing. The `development` name is special - truffle uses it by default
		// if it's defined here and no other network is specified at the command line.
		// You should run a client (like ganache-cli, geth or parity) in a separate terminal
		// tab if you use this network and you must also set the `host`, `port` and `network_id`
		// options below to some value.

		development: {
			provider: () => {
				return new GSNProvider("http://localhost:8545", {
					// we set default to false here and use it explicitly when needed
					useGSN: false,
				})
			},
			port: 8545,
			network_id: "*",
		},

		test: {
			provider: () => {
				return new HDWalletProvider(mnemonic, "http://localhost:8545")
			},
			port: 8545,
			network_id: "*",
		},

		rinkeby: {
			provider: () => {
				return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/303b722ab2ff4afb8b0f8f6a966ab6af")
			},
			network_id: 4,
			gas: 10000000, // 10.000.000
			gasPrice: 3000000000, // 3gwei in wei
			skipDryRun: true,
		},

		ropsten: {
			provider: () => {
				return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/303b722ab2ff4afb8b0f8f6a966ab6af")
				/* return new PrivateKeyProvider(
					process.env.MAINNET_PRIVATE_KEY,
					"https://ropsten.infura.io/v3/303b722ab2ff4afb8b0f8f6a966ab6af"
				) */
			},
			network_id: 3,
			gas: 8000000, // 8.000.000
			gasPrice: 3000000000, // 3gwei in wei
			skipDryRun: true,
		},

		mainnet: {
			provider: () => {
				return new PrivateKeyProvider(
					process.env.MAINNET_PRIVATE_KEY,
					"https://mainnet.infura.io/v3/77249052ac71443eb63e5fdd8b61893e"
				)
			},
			network_id: 1,
			gas: 2000000,
			gasPrice: 69000000000, // wei
			skipDryRun: true,
		},
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		reporter: "eth-gas-reporter",
		reporterOptions: {
			currency: "EUR",
			gasPrice: 30,
			url: "http://localhost:8545",
		},
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.6.6", // Version truffle should use, default: truffle's internal version
			docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 1024, // 2^10
				},
				evmVersion: "istanbul",
			},
		},
	},

	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
	},

	plugins: ["truffle-security", "solidity-coverage", "truffle-plugin-verify"],
}
