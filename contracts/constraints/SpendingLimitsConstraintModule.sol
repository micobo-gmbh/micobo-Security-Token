pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


/**
 * @author Simon Dosch
 * @title SpendingLimitsConstraintModule
 * @dev ConstraintModule
 * Set spending limits like:
 * Not more than 2000/500/100 tokens every 24h/12h/6h etc
 */
contract SpendingLimitsConstraintModule is IConstraintModule {
	using SafeMath for uint256;

	/**
	 * @dev Address of securityToken this ConstraintModule is used by
	 */
	ISecurityToken _securityToken;

	/**
	 * @dev Standard module name
	 */
	bytes32 private _module_name = bytes32("SPENDING_LIMIT");

	// EVENTS
	/**
	 * @dev Emitted when a timelock entry was added
	 */
	event TimelockAdded(uint256 periodLength, uint256 amountAllowed);

	/**
	 * @dev Emitted when a timelock entry was set to a new value
	 */
	event TimelockSet(
		uint256 index,
		uint256 periodLength,
		uint256 amountAllowed
	);

	/**
	 * @dev Emitted when a timelock entry was deleted
	 */
	event TimelockDeleted(uint256 index);

	// MODULE DATA
	/**
	 * @dev Describes a spending limit with periodLength and amountAllowed
	 */
	struct SpendingLimit {
		uint256 periodLength;
		uint256 amountAllowed;
	}

	/**
	 * @dev Describes user specific data for saving amounts already spent
	 */
	struct User {
		uint256 amount;
		uint256 periodEnd;
	}

	/**
	 * @dev Contains limits for different time periods
	 */
	SpendingLimit[] private _spendinglimits;

	/**
	 * @dev Tracks the current spending of accounts in a period, Account - TimelockIndex - User
	 */
	mapping(address => mapping(uint256 => User)) private _ATU;

	/**
	 * [SpendingLimitsConstraintModule CONSTRUCTOR]
	 * @dev Initialize SpendingLimitsConstraintModule with security token address
	 * @param tokenAddress Address of securityToken this ConstraintModule is used by
	 */
	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
	}

	// MODULE FUNCTIONS
	/**
	 * @dev Modifier to make a function callable only when the caller is SPENDING_LIMITS_EDITOR
	 */
	modifier onlySpendingLimitsEditor {
		require(
			_securityToken.hasRole(
				bytes32("SPENDING_LIMITS_EDITOR"),
				msg.sender
			),
			"!SPENDING_LIMITS_EDITOR"
		);
		_;
	}

	/**
	 * @dev Adds a new timelock entry
	 * @param periodLength Length of limiting time period
	 * @param amountAllowed Amount that can be spent in this period
	 */
	function addTimelock(uint256 periodLength, uint256 amountAllowed)
		public
		onlySpendingLimitsEditor
	{
		_spendinglimits.push(SpendingLimit(periodLength, amountAllowed));
		emit TimelockAdded(periodLength, amountAllowed);
	}

	/**
	 * @dev Edits an existing timelock entry
	 * @param index Index of timelock entry
	 * @param periodLength Length of limiting time period
	 * @param amountAllowed Amount that can be spent in this period
	 */
	function setTimelock(
		uint256 index,
		uint256 periodLength,
		uint256 amountAllowed
	) public onlySpendingLimitsEditor {
		require(_spendinglimits.length > index, "out of bounds");
		_spendinglimits[index] = SpendingLimit(periodLength, amountAllowed);
		emit TimelockSet(index, periodLength, amountAllowed);
	}

	/**
	 * @dev Deletes an existing timelock entry
	 * @param index Index of timelock entry
	 */
	function deleteTimelock(uint256 index) public onlySpendingLimitsEditor {
		require(_spendinglimits.length > index, "out of bounds");
		_spendinglimits[index] = _spendinglimits[_spendinglimits.length - 1];
		_spendinglimits.pop();
		emit TimelockDeleted(index);
	}

	/**
	 * @dev Validates live transfer. Can modify state
	 * @param from Token holder.
	 * @param value Number of tokens to transfer.
	 * @return invalid transfer is valid
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function executeTransfer(
		address, /* msg_sender */
		bytes32, /* partition */
		address, /* operator */
		address from,
		address, /* to */
		uint256 value,
		bytes memory, /* data */
		bytes memory /* operatorData */
	)
		public
		override
		returns (
			// we start with false here to save gas and negate it before returning --> (!invalid)
			bool invalid,
			string memory reason
		)
	{
		// if any of the timelocks are violated, valid is set to false
		for (uint256 i = 0; i < _spendinglimits.length; i++) {
			User storage user = _ATU[from][i];

			// period has not ended, there has been at least 1 tx
			if (now <= user.periodEnd) {
				// accumulated amount plus the amount to be transferred exceeds the allowed amount
				if (user.amount.add(value) > _spendinglimits[i].amountAllowed) {
					invalid = true;
					reason = "spending limit for this period reached";
				} else {
					// accumulated amount plus the amount to be transferred does not exceed the allowed amount
					// increase accumulated amount and leave periodEnd
					user.amount = user.amount.add(value);
				}
			} else {
				// period ended, no tx in the relevant timeperiod
				if (value > _spendinglimits[i].amountAllowed) {
					invalid = true;
					reason = "spending limit for this period reached";
				} else {
					user.amount = value;
					user.periodEnd = _spendinglimits[i].periodLength.add(now);
				}
			}
		}

		return (!invalid, reason);
	}

	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}
}
