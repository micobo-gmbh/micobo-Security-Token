pragma solidity ^0.5.0;

contract ConstraintsLogicContract {

    // this needs to match the proxy's storage order
    address public constraintsLogicContract;

    mapping(address => mapping(uint => uint)) userList;

	function editUserList(address user, uint key, uint value) public {
	    userList[user][key] = value;

	}

	function getUserListEntry(address user, uint key) public view returns(uint value) {
	    return userList[user][key];
	}

    function check() public pure returns (bool authorized)  {
        return true;
    }

}