pragma solidity 0.5.0;

import "../administration/AdministrationInterface.sol";
import "../constraints/ConstraintsInterface.sol";

// we inherit the old contracts interface to make sure we don't break anything

contract NewConstraintsLogic is ConstraintsInterface{

    // this needs to match the master's storage order
    address public _constraintsLogic;

    /**
     * @dev The Administration Master Contract
     */
    AdministrationInterface public _admin;


    /**
    * @dev every user has their own mapping that can be filled with information
    * entry keys are uints derived from the `Code` enum and point to uint values which can represent anything
    */
    mapping(address => mapping(uint => uint)) _userList;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value
    );

    enum Code {
        SEND,
        RECEIVE,
        SOME_NEW_CODE,
        WE_CAN_EXPAND_THIS_HOWEVER_WE_WANT,
        BUT_WE_CANNOT_DELETE_OLD_CODES,
        JUST_AS_WE_CANT_DELETE_OLD_DATA
    }

    modifier onlyConstraintEditor() {
        require(_admin.isConstraintsEditor(msg.sender), 'only CONSTRAINTS_EDITOR allowed');
        _;
    }

    function editUserList(address user, uint key, uint value) onlyConstraintEditor public returns (bool) {
        _userList[user][key] = value;
        return true;
    }

    function getUserListEntry(address user, uint key) public view returns (uint value) {
        return _userList[user][key];
    }

    function check(
        address msg_sender,
        address from,
        address to,
        uint256 value)
    public returns (
        bool authorized,
        string memory message)
    {

        // we don't use require here, because errors are not thrown through low-level calls like delegatecall
        // so we return the error message explicitly

        // SEND(0) == 1   check if from address can send
        if (_userList[from][uint(Code.SEND)] == 0) {
            return (false, "_from address cannot send");
        }

        // RECEIVE(1) == 1   check if to address can receive
        if (_userList[to][uint(Code.RECEIVE)] == 0) {
            return (false, "_to address cannot receive");
        }

        // SOME_NEW_CODE(2) == 1234   check if this entry is 1234
        if (_userList[from][uint(Code.SOME_NEW_CODE)] != 1234) {
            return (false, "some_new_code is not 1234 for _from address, sorry man!");
        }

        emit Authorised(msg_sender, from, to, value);
        return (true, "authorized");
    }

}