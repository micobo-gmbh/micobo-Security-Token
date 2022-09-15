module.exports = {
	conf: {
		name: "micobo Security Token",
		symbol: "MST",
		// using 2 to test granularity
		granularity: 2,
		standardPartition: "0x0000000000000000000000000000000000000000000000000000000000000000", // base partition
		standardCap: 1000000,
	},

	mock: {
		cap: 1000,
		primaryMarketEndTimestamp: 1694234541,
		currencyAddress: "0x123481eD7f5E326e3bEA0D3AaD980BC12e44adcf",
	},
}
