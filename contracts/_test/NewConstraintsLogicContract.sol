pragma solidity ^0.5.0;

contract NewConstraintsLogicContract {

    // this needs to match the proxy's storage order
    address public constraintsLogicContract;

    mapping(address => mapping(uint => uint)) userList;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value
    );

    enum Codes {
        SEND,
        RECEIVE,
        SOME_NEW_CODE,
        WE_CAN_EXPAND_THIS_HOWEVER_WE_WANT,
        BUT_WE_CANNOT_DELETE_OLD_CODES,
        JUST_AS_WE_CANT_DELETE_OLD_DATA
    }

    function editUserList(address user, uint key, uint value) public returns (bool) {
        userList[user][key] = value;
        return true;
    }

    function getUserListEntry(address user, uint key) public view returns (uint value) {
        return userList[user][key];
    }

    function check(
        address _msg_sender,
        address _from,
        address _to,
        uint256 _value)
    public returns (
        bool authorized,
        string memory message
    )  {

        // we don't use require here, because errors are not thrown through low-level calls like delegatecall
        // so we return the error message explicitly

        // SEND(0) == 1   check if from address can send
        if (userList[_from][uint(Codes.SEND)] != 1) {
            return (false, "_from address cannot send");
        }

        // RECEIVE(1) == 1   check if to address can receive
        if (userList[_to][uint(Codes.RECEIVE)] != 1) {
            return (false, "_to address cannot receive");
        }

        // SOME_NEW_CODE(2) == 1234   check if this entry is 1234
        if (userList[_from][uint(Codes.SOME_NEW_CODE)] == 1234) {
            return (false, "some_new_code is not 1234 for _from address, sorry man!");
        }

        emit Authorised(_msg_sender, _from, _to, _value);
        return (true, "authorized");
    }

}