pragma solidity 0.5.12;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract VestingPeriodConstraintModule is IConstraintsModule {

    // accounts can only transfer tokens when they are vested

    using SafeMath for uint256;

    ISecurityToken _securityToken;

    string private module_name;

    // time until vesting starts
    mapping(bytes32 => uint256) vestingStartByPartition;

    // fraction vested after starting
    mapping(bytes32 => uint256) vestedFractionAfterStartByPartition;

    // fraction of tokens vested in 1 month
    mapping(bytes32 => uint256) vestingRatioByPartition;

    mapping(bytes32 => mapping(address => uint256)) amountSpentByUserByPartition;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value,
        string module_name
    );

    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
    }

    function setVestingOptionsByPartition (
        bytes32 partition,
        uint256 vestingStart,               // timestamp in seconds when vesting should start
        uint256 vestedFractionAfterStart,   // i.e. 4  => 1/4
        uint256 vestingRatio                // i.e. 48 => 1/48
    ) public {
        require(_securityToken.hasRole(11, msg.sender), 'A8');

        vestingStartByPartition[partition] = vestingStart;
        vestedFractionAfterStartByPartition[partition] = vestedFractionAfterStart;
        vestingRatioByPartition[partition] = vestingRatio;
    }

    function isValid(
        address /* msg_sender */,
        bytes32 partition,
        address /* operator */,
        address from,
        address /* to */,
        uint256 value,
        bytes memory /* data */,
        bytes memory /* operatorData */
    )
    public
    returns (
        // we start with false here to save gas and negate it before returning --> (!invalid)
        bool invalid,
        string memory message
    )
    {
        // dormant Period not over
        if (now < vestingStartByPartition[partition]) {
            invalid = true;
            message = 'A8 - vesting has not started yet';

        // dormant period is over
        } else {

            // amount exceeds allowance minus amountAlreadySpent by this acount
            if (value > getAmountAllowed(partition, from)
                .sub(amountSpentByUserByPartition[partition][from])
            ) {
                invalid = true;
                message = 'A8 - amount exceeds allowance';

            // amount is OK
            } else {
                // add value to this users spendings
                amountSpentByUserByPartition[partition][from].add(value);
            }
        }
        return (!invalid, message);
    }

    function getAmountAllowed(bytes32 partition, address from) internal view returns (uint256) {
        // calculate the original amount of tokens this account got
        uint256 userOriginalBalance = _securityToken
            .balanceOfByPartition(partition, from)
            .add(amountSpentByUserByPartition[partition][from]);

        return
            // the starting amount after the dormant period has passed
            // (i.e 1/4 where 4 is the fraction, hence originalBalance / fraction)
            (userOriginalBalance.div(vestedFractionAfterStartByPartition[partition]))

            // add to this
            .add(
                // the original balance multiplied by
                userOriginalBalance.mul(
                    // the seconds that have passed since the dormant period was over
                    // now - vestingStart
                    (now
                    .sub(vestingStartByPartition[partition]))
                    // divided by 1 month in seconds, gives us the number in months
                    .div(2628288)
                )
                // so by multiplying with the monthsPassed and now dividing by the fraction the amount grows every month
                // (i.e. 48),
                .div(vestingRatioByPartition[partition])
            );

            // we get the total amountAllowed at this point in time
    }


    // VIEW

    function getModuleName() public view returns (string memory) {
        return module_name;
    }

    function getVestingStartByPartition(bytes32 partition) public view returns (uint256) {
        return vestingStartByPartition[partition];
    }

    function getVestedFractionAfterStartByPartition(bytes32 partition) public view returns (uint256) {
        return vestedFractionAfterStartByPartition[partition];
    }

    function getVestingRatioByPartition(bytes32 partition) public view returns (uint256) {
        return vestingRatioByPartition[partition];
    }

    function getVestingRatioByPartition(bytes32 partition, address user) public view returns (uint256) {
        return amountSpentByUserByPartition[partition][user];
    }
}
