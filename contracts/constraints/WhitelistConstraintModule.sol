pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


/**
 * @author Simon Dosch
 * @title WhitelistConstraintModule
 * @dev ConstraintModule
 * Whitelist account to receive tokens
 */
contract WhitelistConstraintModule is IConstraintModule {
	/**
	 * @dev Address of securityToken this ConstraintModule is used by
	 */
	ISecurityToken _securityToken;

	/**
	 * @dev Standard module name
	 */
	bytes32 private _module_name = bytes32("WHITELIST");

	// EVENTS
	/**
	 * @dev Emitted when whitelist is edited
	 */
	event WhitelistEdit(address account, bool whitelisted);

	//  MODULE DATA
	/**
	 * @dev Tracks whitelisted accounts
	 */
	mapping(address => bool) private _whitelist;

	// TODO maybe change to canSend and can Receive

	/**
	 * [WhitelistConstraintModule CONSTRUCTOR]
	 * @dev Initialize WhitelistConstraintModule with security token address
	 * @param tokenAddress Address of securityToken this ConstraintModule is used by
	 */
	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
	}

	// MODULE FUNCTIONS
	/**
	 * @dev Returns true if an account is whitelisted
	 * @param account Address of requested account
	 * @return bool True if account is whitelisted
	 */
	function isWhitelisted(address account) public view returns (bool) {
		return _whitelist[account];
	}

	/**
	 * @dev Edits the whitelist
	 * @param account Address of account to be edited
	 * @param whitelisted If account will be whitelisted
	 */
	function editWhitelist(address account, bool whitelisted) public {
		require(
			_securityToken.hasRole(bytes32("WHITELIST_EDITOR"), msg.sender),
			"A8"
		);
		_editWhitelist(account, whitelisted);
	}

	/**
	 * @dev Edits the whitelist in bulk
	 * @param accounts Addresses of accounts to be edited
	 * @param whitelisted If accounts will be whitelisted
	 */
	function bulkEditWhitelist(address[] memory accounts, bool whitelisted)
		public
	{
		require(
			_securityToken.hasRole(bytes32("WHITELIST_EDITOR"), msg.sender),
			"A8"
		);

		for (uint256 i = 0; i < accounts.length; i++) {
			_editWhitelist(accounts[i], whitelisted);
		}
	}

	/**
	 * @dev Edits the whitelist internally
	 * @param account Address of account to be edited
	 * @param whitelisted If account will be whitelisted
	 */
	function _editWhitelist(address account, bool whitelisted) internal {
		_whitelist[account] = whitelisted;
		emit WhitelistEdit(account, whitelisted);
	}

	/**
	 * @dev Validates live transfer. Can modify state
	 * @param msg_sender Sender of this function call
	 * @param partition Partition the tokens are being transferred from
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer.
	 * @param operatorData Information attached to the transfer, by the operator.
	 * @return valid transfer is valid
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function executeTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external override returns (bool, string memory) {
		(bool valid, , , string memory reason) = validateTransfer(
			msg_sender,
			partition,
			operator,
			from,
			to,
			value,
			data,
			operatorData
		);

		return (valid, reason);
	}

	/**
	 * @dev Validates transfer. Cannot modify state
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @return valid transfer is valid
	 * @return code ERC1066 error code
	 * @return extradata Additional bytes32 parameter that can be used to define
	 * application specific reason codes with additional details (for example the
	 * transfer restriction rule responsible for making the transfer operation invalid).
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function validateTransfer(
		address, /* msg_sender */
		bytes32, /* partition */
		address, /* operator */
		address from,
		address to,
		uint256, /* value */
		bytes memory, /* data */
		bytes memory /* operatorData */
	)
		public
		override
		view
		returns (
			bool valid,
			bytes1 code,
			bytes32 extradata,
			string memory reason
		)
	{
		if (_whitelist[from] && _whitelist[to]) {
			return (true, code, extradata, "");
		} else if (!_whitelist[from]) {
			return (false, hex"A8", "", "A8 - sender not whitelisted");
		} else {
			return (false, hex"A8", "", "A8 - recipient not whitelisted");
		}
	}

	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}
}
