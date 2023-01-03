// const securityTokenFactoryJSON = require("../build/contracts/SecurityTokenFactory.json")
const usdcJSON = require("../build/contracts/UChildERC20.json")

module.exports = async (callback) => {
	try {
		await sendTestTokens()
	} catch (e) {
		console.log(e)
	}

	callback()
}

const currencyTokenAddress = "0x9E2B03EffA92CdCE71b34e9E4C00b67b1Aa49c0D"

const checkBalance = async () => {
	const accounts = await web3.eth.getAccounts()

	currency = new web3.eth.Contract(usdcJSON.abi, currencyTokenAddress)

	balance = await currency.methods.balanceOf(accounts[0]).call({
		from: accounts[0],
	})

	console.log(balance)

	balance = await currency.methods.balanceOf(accounts[1]).call({
		from: accounts[0],
	})

	console.log(balance)
}

const sendTransaction = async () => {
	const accounts = await web3.eth.getAccounts()

	const tx = {
		from: accounts[0],
		nonce: "0x6d6",
		gasPrice: "0x77359400",
		gas: "0x5b8d80",
		to: "0xabbb6a4889ccddb7fd8b461ac1157349c8067870",
		value: "0x0",
		data: "0x83966b220000000000000000000000000000000000000000000000005780dba1f7b5ab0c000000000000000000000000a0420ca9f376ad69aa47770d89545c9ff6a34b40000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a413272dda00000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000024269e2057b904d1fa6a7b52056a8580a85180f000000000000000000000000024269e2057b904d1fa6a7b52056a8580a85180f000000000000000000000000024269e2057b904d1fa6a7b52056a8580a85180f000000000000000000000000024269e2057b904d1fa6a7b52056a8580a85180f000000000000000000000000024269e2057b904d1fa6a7b52056a8580a85180f000000000000000000000000000000000000000000000000000000000000000a4c6f63616c2074657374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003545354000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	}

	const signedTx = await web3.eth.signTransaction(tx, accounts[0])

	console.log(signedTx)

	const receipt = await web3.eth.sendSignedTransaction(signedTx)

	console.log(receipt ? receipt.status : receipt)
}

const updateImplementation = async () => {
	const accounts = await web3.eth.getAccounts()

	securityTokenFactory = new web3.eth.Contract(
		securityTokenFactoryJSON.abi,
		"0xaBBb6A4889CCDdb7FD8b461AC1157349c8067870"
	)

	await securityTokenFactory.methods.updateImplementation("0xc1aAB2dc3Fe5082D2D3eAaf67f4D49619B9862C9").send({
		from: accounts[0],
	})

	let result = await securityTokenFactory.methods.implementationContract().call()
	console.log("logic:", result)
	console.log("Should be: ", "0xc1aAB2dc3Fe5082D2D3eAaf67f4D49619B9862C9")
}

const fundLogicDeployerWallet = async () => {
	const accounts = await web3.eth.getAccounts()

	await web3.eth.sendTransaction({
		to: "0x5edf1344eDB291ED1B2d921D8bE4ef49d4C7E2a0",
		from: accounts[0],
		value: web3.utils.toWei("1"),
	})

	const balance = await web3.eth.getBalance("0x5edf1344eDB291ED1B2d921D8bE4ef49d4C7E2a0")
	console.log(balance)
}

const fundFactoryDeployerWallet = async () => {
	const accounts = await web3.eth.getAccounts()

	await web3.eth.sendTransaction({
		to: "0xa0420ca9f376aD69aA47770D89545c9Ff6a34B40",
		from: accounts[0],
		value: web3.utils.toWei("1"),
	})

	const balance = await web3.eth.getBalance("0xa0420ca9f376aD69aA47770D89545c9Ff6a34B40")
	console.log(balance)
}
