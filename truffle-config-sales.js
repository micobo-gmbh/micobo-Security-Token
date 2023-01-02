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

	contracts_directory: "./sales",
	test_directory: "./test/test_sale",

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

		coverage: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*",
			gas: 10000000, // 10.000.000
		},

		rinkeby: {
			provider: () => {
				return new HDWalletProvider(
					test_mnemonic,
					"https://rinkeby.infura.io/v3/303b722ab2ff4afb8b0f8f6a966ab6af"
				)
			},
			network_id: 4,
			gas: 10000000, // 10.000.000
			gasPrice: 3000000000, // 3gwei in wei
			skipDryRun: true,
		},

		ropsten: {
			provider: () => {
				return new HDWalletProvider(
					test_mnemonic,
					"https://ropsten.infura.io/v3/303b722ab2ff4afb8b0f8f6a966ab6af"
				)
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
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		reporter: "eth-gas-reporter",
		reporterOptions: {
			src: "./sales",
			currency: "EUR",
			token: "MATIC",
			coinmarketcap: "a7f0b6d9-a02e-4303-8835-9c9b3441ae1e", // sd@micobo.com
			// gasPrice: 30,
			// gets the current gasPrice dynamically if not set
			url: "http://localhost:8545",
		},
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.17", // Version truffle should use, default: truffle's internal version
			docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 1024, // 2^10
					// A “runs” parameter of “1” will produce short but expensive code. In contrast, a larger “runs” parameter will produce longer but more gas efficient code.
					// https://docs.soliditylang.org/en/v0.8.17/internals/optimizer.html
				},
				evmVersion: "london",
			},
		},
	},

	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
		polygonscan: process.env.POLYGONSCAN_API_KEY,
	},

	plugins: ["solidity-coverage", "truffle-plugin-verify"],
}
