module.exports = async () => {
	let receipt = await web3.eth.getTransactionReceipt(
		"0xc162a856d49e713c05137f0f3c7cdca7c8171061547536fe73a7de19e00e5187"
	)
	console.log(receipt)

	/* let objects = await web3.eth.getPendingTransactions().catch((e) => {
        console.log(e)
    })
	console.log(objects)
	for (const o in objects) {
		console.log(o)
		if (o.hash == "0xc162a856d49e713c05137f0f3c7cdca7c8171061547536fe73a7de19e00e5187") {
			console.log(o)
		}
	} */
}
