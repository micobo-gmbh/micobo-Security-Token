const truffleAssert = require("truffle-assertions")
const UniSale = artifacts.require("UniSale")
const uniSaleJSON = require("../../build/contracts/UniSale.json")
const proxyJSON = require("../../build/contracts/InitializableAdminUpgradeabilityProxy.json")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const usdcJSON = require("../../build/contracts/UChildERC20.json")
const { Role } = require("../test_token/Constants")
const { conf, mock } = require("../../token-config")
const sigUtil = require("@metamask/eth-sig-util")

contract("Test Meta Transactions", async (accounts) => {
	let sale, securityToken, salt

	const investor = accounts[1]

	const amount = 100

	const premintWallet = accounts[9]

	const currencyName = "USD Coin (PoS)"
	const usdcDecimals = 6

	const rate = (2 * 10) ^ usdcDecimals

	const testAccountOnePrivateKey = Buffer.from(
		"699a3330ff6a28970c9d50df3f747332e86e742e27d25a59efcbd4c0d27fb065",
		"hex"
	)

	before(async () => {
		const networkId = await web3.eth.net.getId()

		// deploy security token (this will be bought)
		securityToken = new web3.eth.Contract(securityTokenJSON.abi, securityTokenJSON.networks[networkId].address)
		tokenAddress = securityToken.options.address

		// deploy test USDC token
		currencyToken = new web3.eth.Contract(usdcJSON.abi)
		currencyToken = await currencyToken
			.deploy({
				data: usdcJSON.bytecode,
				arguments: [],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		// init, make account 0 "childChainManager" who can deposit/mint tokens
		await currencyToken.methods
			.initialize(currencyName, "USDC", 18, accounts[0])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// console.log("USDC deployed at: ", currencyToken.options.address)

		// new whitelist module
		whitelist = new web3.eth.Contract(whitelistConstraintModuleJSON.abi)
		whitelist = await whitelist
			.deploy({
				data: whitelistConstraintModuleJSON.bytecode,
				arguments: [securityToken.options.address],
			})
			.send({
				from: accounts[0],
				gas: 9000000,
			})

		await securityToken.methods.setModulesByPartition(conf.standardPartition, [whitelist.options.address])

		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0], gasLimit: 1000000 })

		// deploy new UniSale proxy
		const uniSaleContract = new web3.eth.Contract(uniSaleJSON.abi)
		const data = uniSaleContract.methods.initialize().encodeABI()
		saleLogic = await UniSale.new()
		let proxy = new web3.eth.Contract(proxyJSON.abi)
		proxy = await proxy
			.deploy({ data: proxyJSON.bytecode, arguments: [] })
			.send({ from: accounts[0], gas: 9000000 })
		await proxy.methods.initialize(saleLogic.address, accounts[9], data).send({from: accounts[0], gas: 9000000})
		sale = await UniSale.at(proxy.options.address)

		await sale.addSalesChannel(
			tokenAddress, // tokenAddress
			accounts[0], //issuerWallet
			whitelist.options.address, // whitelistAddress
			mock.primaryMarketEndTimestamp, // primaryMarketEndTimestamp
			mock.cap, // saleCap, for mass testing
			conf.standardPartition, //partition
			premintWallet, // premintWallet. setting premintWallet to zero deactivates preminting and will mint when tokens are claimed
			mock.currencyAddress, //currencyAddress
			rate, // rate
			true, // useDeferredMinting
			true // useLimit
		)

		// console.log("Sale deployed at: ", sale.address)

		// getting actual chainId from sale contract, more reliable than web3.eth.getChainId()
		chainId = await sale.getChainId()
		// console.log("ChainID: ", chainId.toNumber())

		salt = web3.utils.padLeft(web3.utils.numberToHex(chainId), 64)

		// make sale contract controller
		await securityToken.methods
			.addRole(Role.CONTROLLER, sale.address)
			.send({ from: accounts[0], gasLimit: 1000000 })


		// make whitelist editor
		await securityToken.methods
			.addRole(Role.WHITELIST_EDITOR, accounts[0])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// whitelist user
		await whitelist.methods.editWhitelist(accounts[1], true).send({ from: accounts[0], gasLimit: 1000000 })

		// increase limit for buyer
		await sale.editPurchaseLimits(tokenAddress, conf.standardPartition, accounts[1], amount)

		// add currency
		await sale.editCurrencyRates(tokenAddress, conf.standardPartition, currencyToken.options.address, rate)
	})

	it("fails if stablecoin balance too low", async () => {
		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount)

		let { r, s, v } = await signMetaTransactionForCurrency(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(tokenAddress, conf.standardPartition, currencyToken.options.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"stablecoin balance too low"
		)
	})

	it("can use meta transaction to buy tokens", async () => {
		// issue some test coins
		let depositData = web3.eth.abi.encodeParameter("uint256", amount * rate)
		await currencyToken.methods.deposit(accounts[1], depositData).send({ from: accounts[0], gasLimit: 1000000 })

		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate)

		let { r, s, v } = await signMetaTransactionForCurrency(functionSig)

		// execute the purchase
		await sale.purchaseWithAuthorization(tokenAddress, conf.standardPartition, currencyToken.options.address, amount, investor, r, s, v)

		// see if purchase has happened
		assert.deepEqual((await sale.getPurchase(tokenAddress, conf.standardPartition, accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(tokenAddress, conf.standardPartition), [accounts[1]])

		// deferred, token are not minted yet
		// assert.deepEqual((await securityToken.balanceOf(accounts[1])).toNumber(), amount)

		// see if coins we transferred correctly
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[1]).call()), 0)
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[0]).call()), amount * rate)
	})

	it("claiming fails if premint address is empty", async () => {
		let now = new Date().getTime()
		now = (now / 1000).toFixed(0)
		// set the primaryMarketEnd to 1 second from now
		await sale.editPrimaryMarketEnd(tokenAddress, conf.standardPartition, now - -1)
		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}
		// wait 2 seconds
		await sleep(2000)
		// trigger a transaction to advance blocktime (this is only needed because testnets mine blocks only when needed)
		await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0], value: web3.utils.toWei("1") })

		await truffleAssert.fails(
			sale.claimTokens(tokenAddress, conf.standardPartition, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"insufficient funds"
		)
	})

	it("can claim tokens using meta transaction", async () => {
		// issue tokens to premintWallet
		await securityToken.methods
			.issueByPartition(conf.standardPartition, accounts[9], amount, "0x0")
			.send({ from: accounts[0], gasLimit: 1000000 })

		functionSig = await createClaimTransactionSignature()

		let { r, s, v } = await signMetaTransactionForSale(functionSig)

		await sale.executeMetaTransaction(investor, functionSig, r, s, v)

		// now the tokens should be minted
		assert.deepEqual(parseInt(await securityToken.methods.balanceOf(accounts[1]).call()), amount)
	})

	signMetaTransactionForCurrency = async (functionSig) => {
		// getting the nonce for meta-transactions from the currency token
		let nonce = parseInt(await currencyToken.methods.nonces(investor).call())

		const dataToSign = createTypedData({
			domain: {
				name: currencyName,
				version: "1",
				verifyingContract: currencyToken.options.address,
				salt: salt,
			},
			message: {
				nonce: nonce,
				from: investor,
				functionSignature: functionSig,
			},
		})

		return signMetaTransaction(dataToSign)
	}

	signMetaTransactionForSale = async (functionSig) => {
		// getting the nonce for meta-transactions from the currency token
		let nonce = parseInt(await sale.getNonce(investor))

		const dataToSign = createTypedData({
			domain: {
				name: mock.EIP712Name,
				version: "1",
				verifyingContract: sale.address,
				salt: salt,
			},
			message: {
				nonce: nonce,
				from: investor,
				functionSignature: functionSig,
			},
		})

		return signMetaTransaction(dataToSign)
	}

	signMetaTransaction = async (dataToSign) => {
		// sign the data using private key of account 1 (investor)
		let sig = await sigUtil.signTypedData({
			privateKey: testAccountOnePrivateKey,
			data: dataToSign,
			version: "V3",
		})

		// console.log("Signature: ", sig)

		return getSignatureParameters(sig)
	}

	createTransferTransactionSignature = async (to, amount) => {
		let functionSig = await web3.eth.abi.encodeFunctionCall(
			{
				name: "transfer",
				type: "function",
				inputs: [
					{
						name: "recipient",
						type: "address",
					},
					{
						name: "amount",
						type: "uint256",
					},
				],
			},
			[to, amount]
		)

		// convert it to bytes
		functionSig = web3.utils.hexToBytes(functionSig)

		return functionSig
	}

	createClaimTransactionSignature = async () => {
		let functionSig = await web3.eth.abi.encodeFunctionCall(
			{
				name: "claimTokens",
				type: "function",
				inputs: [
					{
						name: "tokenAddress",
						type: "address",
					},
					{
						name: "partition",
						type: "bytes32",
					},
				],
			},
			[tokenAddress, conf.standardPartition]
		)

		// convert it to bytes
		functionSig = web3.utils.hexToBytes(functionSig)

		return functionSig
	}

	createTypedData = ({ domain, message }) => {
		return {
			types: {
				EIP712Domain: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "version",
						type: "string",
					},
					{
						name: "verifyingContract",
						type: "address",
					},
					{
						name: "salt",
						type: "bytes32",
					},
				],
				MetaTransaction: [
					{
						name: "nonce",
						type: "uint256",
					},
					{
						name: "from",
						type: "address",
					},
					{
						name: "functionSignature",
						type: "bytes",
					},
				],
			},
			domain,
			primaryType: "MetaTransaction",
			message,
		}
	}

	getSignatureParameters = (sig) => {
		// get signature parameters
		if (!web3.utils.isHexStrict(sig)) {
			throw new Error('Given value "'.concat(sig, '" is not a valid hex string.'))
		}
		var r = sig.slice(0, 66)
		var s = "0x".concat(sig.slice(66, 130))
		var v = "0x".concat(sig.slice(130, 132))
		v = web3.utils.hexToNumber(v)
		if (![27, 28].includes(v)) v += 27
		return { r, s, v }
	}
})
