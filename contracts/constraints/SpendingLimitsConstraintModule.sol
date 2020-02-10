pragma solidity 0.5.12;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract SpendingLimitsConstraintModule is IConstraintsModule {

    using SafeMath for uint256;


    // Set spending limits like:
    // Not more than 2000/500/100 tokens every 24h/12h/6h etc


    ISecurityToken _securityToken;

    string private module_name;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value,
        string module_name
    );

    // module data

    // tracks limits for different time periods
    TimeLock[] private _timelocks;

    struct TimeLock {
        uint256 periodLength;
        uint256 amountAllowed;
    }

    // tracks the current spending of accounts in a period, current Partition - Account - TimelockIndex - User
    mapping(bytes32 => mapping(address => mapping(uint256 => User))) private _cPATU;

    struct User {
        uint256 amount;
        uint256 periodEnd;
    }

    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
    }


    // TODO find a way to easily get all timelock entries


    modifier onlySpendingLimitsEditor {
        require(_securityToken.hasRole(10, msg.sender), 'A7');
        _;
    }

    function addTimelock(uint256 periodLength, uint256 amountAllowed) public onlySpendingLimitsEditor{
        _timelocks.push(TimeLock(periodLength, amountAllowed));
    }

    function setTimelock (uint256 index, uint256 periodLength, uint256 amountAllowed) public onlySpendingLimitsEditor{
        require(_timelocks.length > index, "out of bounds");
        _timelocks[index] = TimeLock(periodLength, amountAllowed);
    }

    function deleteTimelock (uint256 index) public onlySpendingLimitsEditor{
        require(_timelocks.length > index, "out of bounds");
        _timelocks[index] = _timelocks[_timelocks.length - 1];
        _timelocks.length--;
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
        bool invalid,
        string memory message
    )
    {

        // if any of the timelocks are violated, valid is set to false
        for (uint i = 0; i < _timelocks.length; i++) {

            User storage user = _cPATU[partition][from][i];

            // period has not ended => there has been at least 1 tx
            if(now <= user.periodEnd) {

                // accumulated amount plus the amount to be transferred exceeds the allowed amount
                if (user.amount.add(value) > _timelocks[i].amountAllowed) {
                    invalid = true;
                    message = 'A8 - spending limit for this period reached';
                }

                // accumulated amount plus the amount to be transferred does not exceed the allowed amount
                else {
                    // increase accumulated amount and leave periodEnd
                    user.amount = user.amount.add(value);
                }
            }

            // period ended => no tx in the relevant timeperiod
            else {
                if (value > _timelocks[i].amountAllowed) {
                    invalid = true;
                    message = 'A8 - spending limit for this period reached';
                }

                else {
                    user.amount = value;
                    user.periodEnd = _timelocks[i].periodLength.add(now);
                }
            }
        }

        return (!invalid, message);
    }
}