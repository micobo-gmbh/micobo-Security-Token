module.exports = {
	Role: {
		ADMIN: web3.utils.padRight(web3.utils.fromAscii("ADMIN"), 64),
		CONTROLLER: web3.utils.padRight(web3.utils.fromAscii("CONTROLLER"), 64),
		ISSUER: web3.utils.padRight(web3.utils.fromAscii("ISSUER"), 64),
		REDEEMER: web3.utils.padRight(web3.utils.fromAscii("REDEEMER"), 64),
		MODULE_EDITOR: web3.utils.padRight(web3.utils.fromAscii("MODULE_EDITOR"), 64),

		DOCUMENT_EDITOR: web3.utils.padRight(web3.utils.fromAscii("DOCUMENT_EDITOR"), 64),
		CAP_EDITOR: web3.utils.padRight(web3.utils.fromAscii("CAP_EDITOR"), 64),

		PAUSER: web3.utils.padRight(web3.utils.fromAscii("PAUSER"), 64),
		WHITELIST_EDITOR: web3.utils.padRight(web3.utils.fromAscii("WHITELIST_EDITOR"), 64),
		TIME_LOCK_EDITOR: web3.utils.padRight(web3.utils.fromAscii("TIME_LOCK_EDITOR"), 64),
		SPENDING_LIMITS_EDITOR: web3.utils.padRight(web3.utils.fromAscii("SPENDING_LIMITS_EDITOR"), 64),
		VESTING_PERIOD_EDITOR: web3.utils.padRight(web3.utils.fromAscii("VESTING_PERIOD_EDITOR"), 64),
		GSN_CONTROLLER: web3.utils.padRight(web3.utils.fromAscii("GSN_CONTROLLER"), 64),

		SALE_ADMIN: web3.utils.padRight(web3.utils.fromAscii("SALE_ADMIN"), 64),
	},

	/*
{ 
	ADMIN:
	'0x41444d494e000000000000000000000000000000000000000000000000000000',
	CONTROLLER:
	'0x434f4e54524f4c4c455200000000000000000000000000000000000000000000',
	ISSUER:
	'0x4953535545520000000000000000000000000000000000000000000000000000',
	REDEEMER:
	'0x52454445454d4552000000000000000000000000000000000000000000000000',
	MODULE_EDITOR:
	'0x4d4f44554c455f454449544f5200000000000000000000000000000000000000',
	DOCUMENT_EDITOR:
	'0x444f43554d454e545f454449544f520000000000000000000000000000000000',
	CAP_EDITOR:
	'0x4341505f454449544f5200000000000000000000000000000000000000000000',
	PAUSER:
	'0x5041555345520000000000000000000000000000000000000000000000000000',
	WHITELIST_EDITOR:
	'0x57484954454c4953545f454449544f5200000000000000000000000000000000',
	TIME_LOCK_EDITOR:
	'0x54494d455f4c4f434b5f454449544f5200000000000000000000000000000000',
	SPENDING_LIMITS_EDITOR:
	'0x5350454e44494e475f4c494d4954535f454449544f5200000000000000000000',
	VESTING_PERIOD_EDITOR:
	'0x56455354494e475f504552494f445f454449544f520000000000000000000000',
	GSN_CONTROLLER:
	'0x47534e5f434f4e54524f4c4c4552000000000000000000000000000000000000',
}
	*/

	Module: {
		TIME_LOCK: web3.utils.padRight(web3.utils.fromAscii("TIME_LOCK"), 64),
		SPENDING_LIMIT: web3.utils.padRight(web3.utils.fromAscii("SPENDING_LIMIT"), 64),
		VESTING: web3.utils.padRight(web3.utils.fromAscii("VESTING"), 64),
		WHITELIST: web3.utils.padRight(web3.utils.fromAscii("WHITELIST"), 64),
		OFF_CHAIN: web3.utils.padRight(web3.utils.fromAscii("OFF_CHAIN"), 64),
	},

	Partitions: {
		BASE: "0x0000000000000000000000000000000000000000000000000000000000000000",
		SECOND: "0x1234567000000000000000000000000000000000000000000000000000000000",
		THIRD: "0x1234543234566000000000000000000000000000000000000000000000000000",
	},
}
