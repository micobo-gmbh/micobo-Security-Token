pragma solidity 0.5.12;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract SpendingLimitsConstraintModule is IConstraintsModule {

    using SafeMath for uint256;

    // TODO test

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

    // tracks the current spending of accounts in a period
    mapping(bytes32 => mapping(address => User)) private _cPAU;

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

    // function edit limits

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
    view
    returns (
        bool valid,
        string memory message
    )
    {
        User memory user = _cPAU[partition][from];
        valid = true;

        // if any of the timelocks a violated, valid is set to false
        for (uint i = 0; i < _timelocks.length; i++) {

            // period has not ended => there has been at least 1 tx
            if(now <= user.periodEnd) {

                // accumulated amount plus the amount to be transferred exceeds the allowed amount
                if (user.amount.add(value) > _timelocks[i].amountAllowed) {
                    valid = false;
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
                user.amount = value;
                user.periodEnd = _timelocks[i].periodLength.add(now);
            }
        }

        return (valid, message);
    }
}