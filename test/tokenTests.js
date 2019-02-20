const ConstraintsLogic = artifacts.require('ConstraintsLogicContract')
const ConstraintsProxy = artifacts.require('ConstraintsProxy')
const ConstraintsInterface = artifacts.require('ConstraintsInterface')
const AosToken = artifacts.require('AosToken')
const AosTokenInterface = artifacts.require('AosTokenInterface')

const truffleAssert = require('truffle-assertions')

const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')
console.log(web3.currentProvider)


contract('Test Token', async () => {
	let contstraintsLogic, constraintsProxy, constraintsInterface, aosToken, aosTokenInterface

	// DEFAULT address all transactions are sent from !
	let testAddress1 = "0x024269E2057b904d1Fa6a7B52056A8580a85180F"

	let testAddress2 = "0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F";


	// deepEqual compares with '==='

	before(async () => {
		contstraintsLogic = await ConstraintsLogic.new()
		console.log('logic address:', contstraintsLogic.address);

		constraintsProxy = await ConstraintsProxy.new(contstraintsLogic.address)
		console.log('proxy address', constraintsProxy.address);

		aosToken = await AosToken.new(constraintsProxy.address, 1000000000)

		aosTokenInterface = await AosTokenInterface.at(aosToken.address)
	})

	it("mints tokens to test addresses", async () => {

		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress1)).toNumber(),
			0
		)

		await aosTokenInterface.mint(testAddress1, 1000);

		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress1)).toNumber(),
			1000
		)


		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress2)).toNumber(),
			0
		)

		await aosTokenInterface.mint(testAddress2, 1000);

		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress2)).toNumber(),
			1000
		)
	})

	it("cannot send token if account is not whitelisted", async () => {

		/* TODO get the error messages thrown by require
		try {
			await aosTokenInterface.transfer(testAddress2, 5)
		} catch (e) {
			let r = await web3.eth.getTransactionReceipt(e.tx);
			console.log(r);
		}
		*/

		truffleAssert.fails(
			aosTokenInterface.transfer(testAddress2, 5),
			truffleAssert.ErrorType.OUT_OF_GAS,
			"_from address cannot send"
		)
	})

	/*
	it("can send tokens from and to authorized addresses", async () => {

		// TODO add whitelist entries

		await aosTokenInterface.transfer(testAddress2, 5)

		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress2)).toNumber(),
			1005
		)
		assert.deepEqual(
			(await aosTokenInterface.balanceOf(testAddress1)).toNumber(),
			995
		)
	})
	*/

})
