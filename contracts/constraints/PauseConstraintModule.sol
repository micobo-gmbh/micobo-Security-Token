pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


/**
 * @author Simon Dosch
 * @title PauseConstraintModule
 * @dev ConstraintModule
 * Stops transfers if set to pause
 */
contract PauseConstraintModule is IConstraintModule {
	/**
	 * @dev Address of securityToken this ConstraintModule is used by
	 */
	ISecurityToken _securityToken;

	/**
	 * @dev Standard module name
	 */
	bytes32 private _module_name = bytes32("PAUSE");

	// EVENTS
	/**
	 * @dev Emitted when the pause is triggered by a pauser (`account`).
	 */
	event Paused(address account);

	/**
	 * @dev Emitted when the pause is lifted by a pauser (`account`).
	 */
	event Unpaused(address account);

	// MODULE DATA
	/**
	 * @dev Indicates the paused state
	 */
	bool private _paused;

	/**
	 * [PauseConstraintModule CONSTRUCTOR]
	 * @dev Initialize PauseConstraintModule with security token address
	 * @param tokenAddress Address of securityToken this ConstraintModule is used by
	 */
	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
		_paused = false;
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
	 * @return reason why is it not valid
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
	) external override returns (bool valid, string memory reason) {
		(valid, , , reason) = validateTransfer(
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
		address, /* from */
		address, /* to */
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
		if (_paused) {
			return (false, hex"A8", "", "A8 - contract is paused");
		} else {
			return (true, code, extradata, "");
		}
	}

	// MODULE FUNCTIONS
	/**
	 * @dev Returns true if the contract is paused, and false otherwise.
	 * @return bool True if the contract is paused
	 */
	function paused() public view returns (bool) {
		return _paused;
	}

	/**
	 * @dev Modifier to make a function callable only when the contract is not paused.
	 */
	modifier whenNotPaused() {
		require(!_paused, "paused");
		_;
	}

	/**
	 * @dev Modifier to make a function callable only when the contract is paused.
	 */
	modifier whenPaused() {
		require(_paused, "not paused");
		_;
	}

	/**
	 * @dev Called by a pauser to pause, triggers stopped state.
	 */
	function pause() public whenNotPaused {
		require(_securityToken.hasRole(bytes32("PAUSER"), msg.sender), "A7");
		_paused = true;
		emit Paused(msg.sender);
	}

	/**
	 * @dev Called by a pauser to unpause, returns to normal state.
	 */
	function unpause() public whenPaused {
		require(_securityToken.hasRole(bytes32("PAUSER"), msg.sender), "A7");
		_paused = false;
		emit Unpaused(msg.sender);
	}

	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}
}
