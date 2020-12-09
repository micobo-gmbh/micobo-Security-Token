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
	ISecurityToken private _securityToken;

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
			"!WHITELIST_EDITOR"
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
			"!WHITELIST_EDITOR"
		);

		require(accounts.length <= 100, "too many accounts");

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
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @return valid transfer is valid
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function executeTransfer(
		address, /* msg_sender */
		bytes32, /* partition */
		address, /* operator */
		address from,
		address to,
		uint256, /* value */
		bytes calldata, /* data */
		bytes calldata /* operatorData */
	) external override returns (bool, string memory) {
		if (_whitelist[from] && _whitelist[to]) {
			return (true, "");
		} else if (!_whitelist[from]) {
			return (false, "sender not whitelisted");
		} else {
			return (false, "recipient not whitelisted");
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
