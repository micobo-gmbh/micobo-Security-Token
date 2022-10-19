const truffleAssert = require("truffle-assertions")
const Sale = artifacts.require("SaleInstant")
const SecurityToken = artifacts.require("SecurityToken")
const securityTokenJSON = require("../../build/contracts/SecurityToken.json")
const WhitelistConstraintModule = artifacts.require("WhitelistConstraintModule")
const USDC = artifacts.require("UChildERC20")
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
		const chainId = await web3.eth.net.getId()

		salt = web3.utils.padLeft(web3.utils.numberToHex(chainId), 64)

		// deploy security token (this will be bought)
		securityToken = await SecurityToken.at(securityTokenJSON.networks[chainId].address)

		// deploy test USDC token
		currencyToken = await USDC.new()

		// init, make account 0 "childChainManager" who can deposit/mint tokens
		await currencyToken.initialize(currencyName, "USDC", 18, accounts[0])

		console.log("USDC deployed at: ", currencyToken.address)

		// new whitelist module
		whitelist = await WhitelistConstraintModule.new(securityToken.address)
		await securityToken.setModulesByPartition(conf.standardPartition, [whitelist.address])

		// deploy Sale
		sale = await Sale.new(
			accounts[0],
			securityToken.address,
			whitelist.address,
			mock.primaryMarketEndTimestamp,
			mock.cap,
			conf.standardPartition,
			accounts[9],
			mock.EIP712Name
		)

		console.log("Sale deployed at: ", sale.address)

		// issue tokens to premintWallet
		await securityToken.issueByPartition(conf.standardPartition, accounts[9], amount, "0x0")

		// make sale contract controller
		await securityToken.addRole(Role.CONTROLLER, sale.address)

		// add sale_admin role
		await securityToken.addRole(Role.SALE_ADMIN, accounts[0])

		// make whitelist editor
		await securityToken.addRole(Role.WHITELIST_EDITOR, accounts[0])

		// whitelist user
		await whitelist.editWhitelist(accounts[1], true)

		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount)

		// add currency
		await sale.editCurrencyRates(currencyToken.address, rate)
	})

	it("fails if stablecoin balance too low", async () => {
		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount)

		let { r, s, v } = await signMetaTransaction(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"stablecoin balance too low"
		)
	})

	it("can use meta transaction to buy tokens", async () => {
		// issue some test coins
		let depositData = web3.eth.abi.encodeParameter("uint256", amount * rate)
		await currencyToken.deposit(accounts[1], depositData)

		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate)

		let { r, s, v } = await signMetaTransaction(functionSig)

		// execute the purchase
		await sale.purchaseWithAuthorization(currencyToken.address, amount, investor, r, s, v)

		// see if purchase has happened
		assert.deepEqual((await sale.getPurchase(accounts[1])).toNumber(), amount)
		assert.deepEqual(await sale.getBuyers(), [accounts[1]])
		assert.deepEqual((await securityToken.balanceOf(accounts[1])).toNumber(), amount)

		// see if coins we transferred correctly
		assert.deepEqual((await currencyToken.balanceOf(accounts[1])).toNumber(), 0)
		assert.deepEqual((await currencyToken.balanceOf(accounts[0])).toNumber(), amount * rate)
	})

	it("fails if premint address is empty", async () => {
		// increase limit for buyer
		await sale.editPurchaseLimits(accounts[1], amount)

		// issue some test coins
		let depositData = web3.eth.abi.encodeParameter("uint256", amount * rate)
		await currencyToken.deposit(accounts[1], depositData)

		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate)

		let { r, s, v } = await signMetaTransaction(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"insufficient funds"
		)
	})

	it("fails if transfer transaction not correct", async () => {
		//create transfer tx, recipient is issuer (acc 0)
		functionSig = await createTransferTransactionSignature(accounts[0], amount * rate - 1)

		let { r, s, v } = await signMetaTransaction(functionSig)

		await truffleAssert.fails(
			sale.purchaseWithAuthorization(currencyToken.address, amount, investor, r, s, v),
			truffleAssert.ErrorType.REVERT,
			"insufficient funds"
		)
	})

	signMetaTransaction = async (functionSig) => {
		// getting the nonce for meta-transactions from the currency token
		let nonce = parseInt(await currencyToken.nonces(investor))

		const dataToSign = createTypedData({
			domain: {
				name: currencyName,
				version: "1",
				verifyingContract: currencyToken.address,
				salt: salt,
			},
			message: {
				nonce: nonce,
				from: investor,
				functionSignature: functionSig,
			},
		})

		// sign the data using private key of account 1 (investor)
		let sig = await sigUtil.signTypedData({
			privateKey: testAccountOnePrivateKey,
			data: dataToSign,
			version: "V3",
		})

		console.log("Signature: ", sig)

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
