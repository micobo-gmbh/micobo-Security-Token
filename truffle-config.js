const HDWalletProvider = require("@truffle/hdwallet-provider")
const PrivateKeyProvider = require("truffle-privatekey-provider")

const { GSNProvider } = require("@openzeppelin/gsn-provider")

require("dotenv").config()

// const infuraKey = "fj4jll3k.....";

const fs = require("fs")
const test_mnemonic = fs.readFileSync(".mnemonic").toString().trim()

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
		// You should run a client (like ganache, geth or parity) in a separate terminal
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
				return new HDWalletProvider(test_mnemonic, "http://localhost:8545")
			},
			port: 8545,
			network_id: "*",
		},

		goerli: {
			provider: () => {
				return new HDWalletProvider(
					test_mnemonic,
					process.env.GOERLI
				)
			},
			network_id: 5,
			gas: 10000000, // 10.000.000
			gasPrice: 100000000, // 0.1 gwei in wei
			skipDryRun: true,
		},

		mainnet: {
			provider: () => {
				return new PrivateKeyProvider(
					process.env.MAINNET_PRIVATE_KEY,
					process.env.MAINNET
				)
			},
			network_id: 1,
			gas: 2000000,
			gasPrice: 69000000000, // wei
			skipDryRun: true,
		},

		polygon: {
			provider: () => {
				return new HDWalletProvider(process.env.POLYGON_MNEMONIC, process.env.POLYGON_MAINNET)
			},
			network_id: 137,
			gasPrice: 69000000000, // wei
			skipDryRun: true,
		},

		mumbai: {
			provider: () => {
				return new HDWalletProvider(test_mnemonic, process.env.POLYGON_MUMBAI)
			},
			network_id: 80001,
			skipDryRun: true,
		},

		logicDeployment: {
			provider: () => {
				return new PrivateKeyProvider(
					process.env.TOKEN_LOGIC_DEPLOYER_PRIVATE_KEY,
					// change to desired network
					process.env.DEPLOYMENT_NETWORK
				)
			},
			network_id: "*",
			// gasPrice: 69000000000, // wei (set before deployment)
			skipDryRun: true,
		},

		factoryDeployment: {
			provider: () => {
				return new PrivateKeyProvider(
					process.env.TOKEN_FACTORY_DEPLOYER_PRIVATE_KEY,
					// change to desired network
					process.env.DEPLOYMENT_NETWORK
				)
			},
			network_id: "*",
			// gasPrice: 69000000000, // wei (set before deployment)
			skipDryRun: true,
		},
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		reporter: "eth-gas-reporter",
		reporterOptions: {
			src: "./contracts",
			currency: "EUR",
			token: "MATIC",
			// gasPrice: 30,
			// gets the current gasPrice dynamically if not set
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
					// A “runs” parameter of “1” will produce short but expensive code. In contrast, a larger “runs” parameter will produce longer but more gas efficient code.
					// https://docs.soliditylang.org/en/v0.8.17/internals/optimizer.html
				},
				evmVersion: "istanbul",
			},
		},
	},

	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
		polygonscan: process.env.POLYGONSCAN_API_KEY,
	},

	plugins: ["solidity-coverage", "truffle-plugin-verify"],
}
