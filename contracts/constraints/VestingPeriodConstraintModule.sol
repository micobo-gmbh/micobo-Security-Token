pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


contract VestingPeriodConstraintModule is IConstraintModule {
	// accounts can only transfer tokens when they are vested

	using SafeMath for uint256;

	ISecurityToken _securityToken;

	bytes32 private _module_name = bytes32("VESTING");

	// time until vesting starts
	uint256 _vestingStart;

	// fraction vested after starting
	uint256 _vestedFraction;

	// fraction of tokens vested in 1 month
	uint256 _vestingRatio;

	mapping(address => uint256) _amountSpentByUser;

	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
	}

	function setVestingOptions(
		uint256 vestingStart, // timestamp in seconds when vesting should start
		uint256 vestedFractionAfterStart, // i.e. 4  => 1/4
		uint256 vestingRatio // i.e. 48 => 1/48
	) public {
		require(_securityToken.hasRole(bytes32("VESTING_PERIOD_EDITOR"), msg.sender), "A8");

		_vestingStart = vestingStart;
		_vestedFraction = vestedFractionAfterStart;
		_vestingRatio = vestingRatio;
	}

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

		if (valid) {
			_amountSpentByUser[from] = _amountSpentByUser[from].add(value);
		}

		return (valid, reason);
	}

	function validateTransfer(
		address, /* msg_sender */
		bytes32 partition,
		address, /* operator */
		address from,
		address, /* to */
		uint256 value,
		bytes memory, /* data */
		bytes memory /* operatorData */
	)
		public
		override
		view
		returns (
			// we start with false here to save gas and negate it before returning --> (!invalid)
			bool invalid,
			bytes1 code,
			bytes32 extradata,
			string memory reason
		)
	{
		// dormant Period not over
		if (now < _vestingStart) {
			return (false, hex"A8", "", "A8 - vesting has not started yet");
		}
		// dormant period is over

		uint256 allowed = getAmountAllowed(partition, from, value);

		// amount exceeds allowance minus amountAlreadySpent by this acount
		if (value > (allowed.sub(_amountSpentByUser[from]))) {
			return (false, hex"A8", "", "A8 - amount exceeds vested amount");
		}

		return (true, code, extradata, reason);
	}

	function getAmountAllowed(
		bytes32 partition,
		address from,
		uint256 value
	) internal view returns (uint256) {
		// calculate the original amount of tokens this account got
		uint256 userOriginalBalance = _securityToken
			.balanceOfByPartition(partition, from)
		// we need to add the value of this transfer as well
			.add(value)
			.add(_amountSpentByUser[from]);

		return
			// the starting amount after the dormant period has passed
			// (i.e 1/4 where 4 is the fraction, hence originalBalance / fraction)

			(userOriginalBalance.div(_vestedFraction))

			// add to this
				.add(
				// the original balance multiplied by
				userOriginalBalance
					.mul(
					// the seconds that have passed since the dormant period was over
					// now - vestingStart
					(now.sub(_vestingStart))
					// divided by 1 month in seconds, gives us the number in months
						.div(2628288)
				)
				// so by multiplying with the monthsPassed and now dividing by the fraction the amount grows every month
				// (i.e. 48),
					.div(_vestingRatio)
			);

		// we get the total amountAllowed at this point in time
	}

	// VIEW

	function getVestingStart() public view returns (uint256) {
		return _vestingStart;
	}

	function getVestedFractionAfterStart() public view returns (uint256) {
		return _vestedFraction;
	}

	function getVestingRatio() public view returns (uint256) {
		return _vestingRatio;
	}

	function getAmountSpentByUser(address user) public view returns (uint256) {
		return _amountSpentByUser[user];
	}

	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}
}
