pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


/**
 * @author Simon Dosch
 * @title TimeLockConstraintModule
 * @dev ConstraintModule
 * Lock specific accounts or the whole partition for a period of time
 */
contract TimeLockConstraintModule is IConstraintModule {
	using SafeMath for uint256;

	/**
	 * @dev Address of securityToken this ConstraintModule is used by
	 */
	ISecurityToken private _securityToken;

	/**
	 * @dev Standard module name
	 */
	bytes32 private _module_name = bytes32("TIME_LOCK");

	// EVENTS
	/**
	 * @dev Emitted when an amount timelock entry is edited
	 */
	event AmountTimeLockEdit(address account, uint256 time, uint256 amount);

	/**
	 * @dev Emitted when an account timelock entry is edited
	 */
	event AccountTimeLockEdit(address account, uint256 time);

	/**
	 * @dev Emitted when the overall timelock entry is edited
	 */
	event TimeLockEdit(uint256 time);

	// MODULE DATA
	/**
	 * @dev Tracks which amounts are locked for how long
	 */
	mapping(address => Lock) private _amountTimeLock;

	struct Lock {
		uint256 time;
		uint256 amount;
	}

	/**
	 * @dev Tracks which accounts are locked for how long
	 */
	mapping(address => uint256) private _accountTimeLock;

	/**
	 * @dev Until when the whole token is locked
	 */
	uint256 private _timeLock;

	/**
	 * [TimeLockConstraintModule CONSTRUCTOR]
	 * @dev Initialize TimeLockConstraintModule with security token address
	 * @param tokenAddress Address of securityToken this ConstraintModule is used by
	 */
	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
	}

	// MODULE FUNCTIONS
	/**
	 * @dev Edits an account timelock entry
	 * @param account The edited account
	 * @param time The new timestamp until which the amount will be locked
	 * @param amount The amount of tokens being locked
	 */
	function editAmountTimeLock(
		address account,
		uint256 time,
		uint256 amount
	) public {
		require(
			_securityToken.hasRole(bytes32("TIME_LOCK_EDITOR"), msg.sender),
			"!TIME_LOCK_EDITOR"
		);
		_amountTimeLock[account] = Lock(time, amount);
		emit AmountTimeLockEdit(account, time, amount);
	}

	/**
	 * @dev Edits an account timelock entry
	 * @param account The edited account
	 * @param time The new timestamp until which this account will be locked
	 */
	function editAccountTimeLock(address account, uint256 time) public {
		require(
			_securityToken.hasRole(bytes32("TIME_LOCK_EDITOR"), msg.sender),
			"!TIME_LOCK_EDITOR"
		);
		_accountTimeLock[account] = time;
		emit AccountTimeLockEdit(account, time);
	}

	/**
	 * @dev Edits the timelock entry
	 * @param time The new timestamp until which this token will be locked
	 */
	function editTimeLock(uint256 time) public {
		require(
			_securityToken.hasRole(bytes32("TIME_LOCK_EDITOR"), msg.sender),
			"!TIME_LOCK_EDITOR"
		);
		_timeLock = time;
		emit TimeLockEdit(time);
	}

	/**
	 * @dev Validates live transfer. Can modify state
	 * @param msg_sender Sender of this function call
	 * @param partition Partition the tokens are being transferred from
	 * @param from Token holder.
	 * @return valid transfer is valid
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function executeTransfer(
		address msg_sender,
		bytes32 partition,
		address, /* operator */
		address from,
		address, /* to */
		uint256, /* value */
		bytes calldata, /* data */
		bytes calldata /* operatorData */
	) external override returns (bool, string memory) {
		if (_timeLock > now) {
			return (false, "partition is still locked");
		} else if (_accountTimeLock[msg_sender] > now) {
			return (false, "account is still locked");
		} else if (_amountTimeLock[msg_sender].time > now) {
			// this balance already has "value" substracted from it
			uint256 userBalance = _securityToken.balanceOfByPartition(
				partition,
				from
			);

			if (userBalance < _amountTimeLock[msg_sender].amount) {
				return (false, "amount is still locked");
			}
		}

		return (true, "");
	}

	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}

	/**
	 * @dev Returns token timelock
	 * @return uint256 unix timestamp until which the token is locked
	 */
	function getTimeLock() public view returns (uint256) {
		return _timeLock;
	}

	/**
	 * @dev Returns account timelock
	 * @return uint256 unix timestamp until which the accounnt is locked
	 */
	function getAccountTimeLock(address account) public view returns (uint256) {
		return _accountTimeLock[account];
	}

	/**
	 * @dev Returns amount timelock
	 * @return time uint256 unix timestamp until which the amount is locked
	 * @return amount uint256 amount that is locked
	 */
	function getAmountTimeLock(address account)
		public
		view
		returns (uint256 time, uint256 amount)
	{
		return (_amountTimeLock[account].time, _amountTimeLock[account].amount);
	}
}
