module.exports = {
	Role: {
		ADMIN: web3.utils.fromAscii("ADMIN"),
		CONTROLLER: web3.utils.fromAscii("CONTROLLER"),
		ISSUER: web3.utils.fromAscii("ISSUER"),
		PAUSER: web3.utils.fromAscii("PAUSER"),
		REDEEMER: web3.utils.fromAscii("REDEEMER"),
		CAP_EDITOR: web3.utils.fromAscii("CAP_EDITOR"),
		MODULE_EDITOR: web3.utils.fromAscii("MODULE_EDITOR"),
		DOCUMENT_EDITOR: web3.utils.fromAscii("DOCUMENT_EDITOR"),
		WHITELIST_EDITOR: web3.utils.fromAscii("WHITELIST_EDITOR"),
		TIME_LOCK_EDITOR: web3.utils.fromAscii("TIME_LOCK_EDITOR"),
		SPENDING_LIMITS_EDITOR: web3.utils.fromAscii("SPENDING_LIMITS_EDITOR"),
		VESTING_PERIOD_EDITOR: web3.utils.fromAscii("VESTING_PERIOD_EDITOR"),
		GSN_CONTROLLER: web3.utils.fromAscii("GSN_CONTROLLER"),
		DEFAULT_PARTITIONS_EDITOR: web3.utils.fromAscii("DEFAULT_PARTITIONS_EDITOR"),
	},

	Module: {
		TIME_LOCK: web3.utils.padRight(web3.utils.fromAscii("TIME_LOCK"), 64),
		PAUSE: web3.utils.padRight(web3.utils.fromAscii("PAUSE"), 64),
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
