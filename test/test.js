const Logic = artifacts.require('ConstraintsLogicContract')
const Proxy = artifacts.require('ConstraintsProxy')
const Interface = artifacts.require('ConstraintsInterface')

contract('Test Proxies', async () => {
	let logic, proxy, proxyInterface
	let testAddress = "0x024269E2057b904d1Fa6a7B52056A8580a85180F"

	// deepEqual compares with '==='

	before(async () => {
		logic = await Logic.new()
		console.log('logic address:', logic.address);
	})

	it("deploys a proxy", async () => {
		proxy = await Proxy.new(logic.address)

		console.log('proxy address', proxy.address);

		// pretend proxy is logic
		proxyInterface = await Interface.at(proxy.address)

		await proxyInterface.editUserList(testAddress, 0, 1)

		// The proxy's UserList entry "0" is "1", after being changed by the logic lib using "delegatecall"
		assert.deepEqual(
			(await proxyInterface.getUserListEntry(testAddress, 0)).toString(10),
			'1'
		)
	})

	it("deploys new logic", async () => {
		logic = await Logic.new()

		console.log('new logic address: ', logic.address)

		await proxy.updateLogicContract(logic.address)

		// The new ConstraintsLogicContract address has been saved to the proxy's storage
		assert.deepEqual(
			await proxy.constraintsLogicContract(),
			logic.address
		)
	})

	it("keeps the storage unaffected by new logic contract", async () => {
		assert.deepEqual(
			(await proxyInterface.getUserListEntry(testAddress, 0)).toString(10),
			'1'
		)
	})


})
