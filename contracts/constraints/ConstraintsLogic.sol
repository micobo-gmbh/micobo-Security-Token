pragma solidity 0.5.0;

import "../administration/AdministrationInterface.sol";

/**
 * @author Simon Dosch
 * @title The logic contract providing constraints functions
 */
contract ConstraintsLogic {

    /**
     * @dev this and _admin need to match the master's storage order
     * so they occupy the same storage space
     */
    address private _constraintsLogic;

    /**
     * @dev The Administration Master Contract
     * needs to match the master's storage order
     */
    AdministrationInterface public _admin;


    /**
     * @dev every user has their own mapping that can be filled with information
     * entry keys are uints derived from the `Code` enum and point to uint values which can represent anything
     */
    mapping(address => mapping(uint => uint)) _userList;

    /**
     * @dev Emitted whenever the _userList is edited
     */
    event UserListEdit(
        address msg_sender,
        address indexed user,
        uint indexed key,
        uint value
    );


    /**
     * @dev Emitted whenever a transaction is authorized by the 'check()' function
     */
    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value
    );

    /**
     * @dev Enum provides uint8 values corresponding to certain codes
     * This is intended to be expanded when updating this contract
     * to hold new Codes for new functionalities
     */
    enum Code {
        SEND,
        RECEIVE
    }

    /**
     * @dev Modifier to make a function callable only when the caller is a CONSTRAINTS_EDITOR.
     */
    modifier onlyConstraintEditor() {
        require(_admin.isConstraintsEditor(msg.sender), 'only CONSTRAINTS_EDITOR allowed');
        _;
    }

    /**
     * @param user the address for which information is being added
     * @param key the key to bbe edited
     * @param value the new value
     * @dev This function allows the modification of the 'userList'
     * @return true is the edit was successful
     */
    function editUserList(address user, uint key, uint value)
    onlyConstraintEditor
    public
    returns (bool)
    {
        _userList[user][key] = value;
        emit UserListEdit(msg.sender, user, key, value);
        return true;
    }

    /**
     * @param user the account that is being queried
     * @param key the key that is being queried
     * @dev Returns the value to the given key and user from 'userList'
     * @return the corresponding value from 'userList'
     */
    function getUserListEntry(address user, uint key) public view returns (uint value) {
        return _userList[user][key];
    }

    /**
     * @param msg_sender sender of the transaction
     * @param from the source account of the token transfer
     * @param to the target account of the token transfer
     * @param value the amount of tokens being transferred
     * @dev This function is being called by 'transfer' and 'transferFrom' to check for constraints
     * @return authorized true if all requirements have been met and false if not, message
     */
    function check(
        address msg_sender,
        address from,
        address to,
        uint256 value)
    public returns (
        bool authorized,
        string memory message)
    {

        // We don't use require here, because errors are
        // not thrown through low-level calls like delegatecall,
        // instead we return the error message explicitly

        // SEND(0) == 1   check if from address can send
        if (_userList[from][uint(Code.SEND)] != 1) {
            return (false, "_from address cannot send");
        }

        // RECEIVE(1) == 1   check if to address can receive
        if (_userList[to][uint(Code.RECEIVE)] != 1) {
            return (false, "_to address cannot receive");
        }

        emit Authorised(msg_sender, from, to, value);
        return (true, "authorized");
    }

}
