pragma solidity 0.6.6;

import '../../node_modules/@openzeppelin/contracts/math/SafeMath.sol';

import '../interfaces/IConstraintModule.sol';
import '../interfaces/ISecurityToken.sol';


contract SpendingLimitsConstraintModule is IConstraintModule {

    using SafeMath for uint256;


    // Set spending limits like:
    // Not more than 2000/500/100 tokens every 24h/12h/6h etc


    ISecurityToken _securityToken;

    string private _module_name = 'SPENDING_LIMIT';

    // module data

    // tracks limits for different time periods
    SpendingLimit[] private _spendinglimits;

    struct SpendingLimit {
        uint256 periodLength;
        uint256 amountAllowed;
    }

    // tracks the current spending of accounts in a period, Account - TimelockIndex - User
    mapping(address => mapping(uint256 => User)) private _ATU;

    struct User {
        uint256 amount;
        uint256 periodEnd;
    }

    address _owner;

    constructor(
        address tokenAddress
    ) public {
        _owner = msg.sender;
        _securityToken = ISecurityToken(tokenAddress);
    }


    // TODO find a way to easily get all timelock entries


    modifier onlySpendingLimitsEditor {
        require(_securityToken.hasRole(bytes32('SPENDING_LIMITS_EDITOR'), msg.sender), 'A7');
        _;
    }

    function addTimelock(uint256 periodLength, uint256 amountAllowed) public onlySpendingLimitsEditor{
        _spendinglimits.push(SpendingLimit(periodLength, amountAllowed));
    }

    function setTimelock (uint256 index, uint256 periodLength, uint256 amountAllowed) public onlySpendingLimitsEditor{
        require(_spendinglimits.length > index, 'out of bounds');
        _spendinglimits[index] = SpendingLimit(periodLength, amountAllowed);
    }

    function deleteTimelock (uint256 index) public onlySpendingLimitsEditor{
        require(_spendinglimits.length > index, 'out of bounds');
        _spendinglimits[index] = _spendinglimits[_spendinglimits.length - 1];
        _spendinglimits.pop();
    }


    function executeTransfer(
        address /* msg_sender */,
        bytes32 /* partition */,
        address /* operator */,
        address from,
        address /* to */,
        uint256 value,
        bytes memory /* data */,
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
        for (uint i = 0; i < _spendinglimits.length; i++) {

            User storage user = _ATU[from][i];

            // period has not ended => there has been at least 1 tx
            if(now <= user.periodEnd) {

                // accumulated amount plus the amount to be transferred exceeds the allowed amount
                if (user.amount.add(value) > _spendinglimits[i].amountAllowed) {
                    invalid = true;
                    reason = 'A8 - spending limit for this period reached';
                }

                // accumulated amount plus the amount to be transferred does not exceed the allowed amount
                else {
                    // increase accumulated amount and leave periodEnd
                    user.amount = user.amount.add(value);
                }
            }

            // period ended => no tx in the relevant timeperiod
            else {
                if (value > _spendinglimits[i].amountAllowed) {
                    invalid = true;
                    reason = 'A8 - spending limit for this period reached';
                }

                else {
                    user.amount = value;
                    user.periodEnd = _spendinglimits[i].periodLength.add(now);
                }
            }
        }

        return (!invalid, reason);
    }



    // VIEW

    function validateTransfer(
        address /* msg_sender */,
        bytes32 /* partition */,
        address /* operator */,
        address from,
        address /* to */,
        uint256 value,
        bytes memory /* data */,
        bytes memory /* operatorData */
    )
    public
    view
    override
    returns (
        // we start with false here to save gas and negate it before returning --> (!invalid)
        bool invalid,
        byte code,
        bytes32 extradata,
        string memory reason
    )
    {

        // if any of the timelocks are violated, valid is set to false
        for (uint i = 0; i < _spendinglimits.length; i++) {

            User storage user = _ATU[from][i];

            // period has not ended => there has been at least 1 tx
            if(now <= user.periodEnd) {

                // accumulated amount plus the amount to be transferred exceeds the allowed amount
                if (user.amount.add(value) > _spendinglimits[i].amountAllowed) {
                    invalid = true;
                    reason = 'spending limit for this period reached';
                    code = hex'A8';
                }

                // accumulated amount plus the amount to be transferred does not exceed the allowed amount
                else {
                    // increase accumulated amount and leave periodEnd

                    // INFO no record keeping for view
                    // user.amount = user.amount.add(value);
                    this;
                }
            }

            // period ended => no tx in the relevant timeperiod
            else {
                if (value > _spendinglimits[i].amountAllowed) {
                    invalid = true;
                    reason = 'spending limit for this period reached';
                    code = hex'A8';
                }

                else {
                    // INFO no record keeping for view
                    // user.amount = value;
                    // user.periodEnd = _spendinglimits[i].periodLength.add(now);
                    this;
                }
            }
        }

        return (!invalid, code, extradata, reason);
    }

    function getModuleName() public override view returns (string memory) {
        return _module_name;
    }
}