module.exports = {
    Role: {
		ADMIN: web3.utils.fromAscii('ADMIN'),
		CONTROLLER: web3.utils.fromAscii('CONTROLLER'),
		ISSUER: web3.utils.fromAscii('ISSUER'),
		PAUSER: web3.utils.fromAscii('PAUSER'),
		REDEEMER: web3.utils.fromAscii('REDEEMER'),
		CAP_EDITOR: web3.utils.fromAscii('CAP_EDITOR'),
		MODULE_EDITOR: web3.utils.fromAscii('MODULE_EDITOR'),
		DOCUMENT_EDITOR: web3.utils.fromAscii('DOCUMENT_EDITOR'),
		WHITELIST_EDITOR: web3.utils.fromAscii('WHITELIST_EDITOR'),
		TIME_LOCK_EDITOR: web3.utils.fromAscii('TIME_LOCK_EDITOR'),
		SPENDING_LIMITS_EDITOR: web3.utils.fromAscii('SPENDING_LIMITS_EDITOR'),
		VESTING_PERIOD_EDITOR: web3.utils.fromAscii('VESTING_PERIOD_EDITOR'),
		GSN_CONTROLLER: web3.utils.fromAscii('GSN_CONTROLLER'),
	}
}