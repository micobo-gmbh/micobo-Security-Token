const truffleAssert = require("truffle-assertions")
const Sale = artifacts.require("SaleInstant")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
const whitelistConstraintModuleJSON = require("../../build/contracts/WhitelistConstraintModule.json")
const usdcJSON = require("../../build/contracts/UChildERC20.json")
const { Role } = require("../Constants")
const { conf, mock } = require("../../token-config")
const sigUtil = require("@metamask/eth-sig-util")

contract("Test Meta Transactions", async (accounts) => {
	let sale, securityToken, salt

	const investor = accounts[1]

	const amount = 100

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

		// deploy Sale
		sale = await Sale.new(
			accounts[0],
			securityToken.options.address,
			whitelist.options.address,
			mock.primaryMarketEndTimestamp,
			mock.cap,
			conf.standardPartition,
			accounts[9],
			mock.EIP712Name
		)

		// console.log("Sale deployed at: ", sale.address)

		// getting actual chainId from sale contract, more reliable than web3.eth.getChainId()
		chainId = await sale.getChainId()
		// console.log("ChainID: ", chainId.toNumber())

		salt = await web3.utils.padLeft(web3.utils.numberToHex(chainId), 64)

		// issue tokens to premintWallet
		await securityToken.methods
			.issueByPartition(conf.standardPartition, accounts[9], amount, "0x0")
			.send({ from: accounts[0], gasLimit: 1000000 })

		// make sale contract controller
		await securityToken.methods
			.addRole(Role.CONTROLLER, sale.address)
			.send({ from: accounts[0], gasLimit: 1000000 })

		// add sale_admin role
		await securityToken.methods.addRole(Role.SALE_ADMIN, accounts[0]).send({ from: accounts[0], gasLimit: 1000000 })

		// make whitelist editor
		await securityToken.methods
			.addRole(Role.WHITELIST_EDITOR, accounts[0])
			.send({ from: accounts[0], gasLimit: 1000000 })

		// whitelist user
		await whitelist.methods.editWhitelist(accounts[1], true).send({ from: accounts[0], gasLimit: 1000000 })

		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount)

		// add currency
		await sale.editCurrencyRates(currencyToken.options.address, rate)
	})

	it("fails if stablecoin balance too low", async () => {
		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount)

		let { r, s, v } = await signMetaTransactionWithAccountOne(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.options.address, amount, investor, r, s, v),
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

		let { r, s, v } = await signMetaTransactionWithAccountOne(functionSig)

		// try with wrong currency
		await truffleAssert.fails(
			sale.purchaseWithAuthorization(mock.zeroWallet, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"this stablecoin is not accepted"
		)

		// execute the purchase
		await sale.purchaseWithAuthorization(currencyToken.options.address, amount, investor, r, s, v)

		// see if purchase has happened
		assert.deepEqual((await sale.getPurchase(accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(), [accounts[1]])
		assert.deepEqual(parseInt(await securityToken.methods.balanceOf(accounts[1]).call()), amount)

		// see if coins we transferred correctly
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[1]).call()), 0)
		assert.deepEqual(parseInt(await currencyToken.methods.balanceOf(accounts[0]).call()), amount * rate)
	})

	it("fails if premint address is empty", async () => {
		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount)

		// issue some test coins
		let depositData = web3.eth.abi.encodeParameter("uint256", amount * rate)
		await currencyToken.methods.deposit(accounts[1], depositData).send({ from: accounts[0], gasLimit: 1000000 })

		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate)

		let { r, s, v } = await signMetaTransactionWithAccountOne(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.options.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"insufficient funds"
		)
	})

	it("fails if transfer transaction not correct", async () => {
		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate - 1)

		let { r, s, v } = await signMetaTransactionWithAccountOne(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.options.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"Signer and signature do not match"
		)
	})

	signMetaTransactionWithAccountOne = async (functionSig) => {
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

		// console.log(dataToSign)

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
		functionSig = await web3.utils.hexToBytes(functionSig)

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
