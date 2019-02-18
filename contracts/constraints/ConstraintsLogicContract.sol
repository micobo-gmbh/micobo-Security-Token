pragma solidity ^0.5.0;

contract ConstraintsLogicContract {

    // this needs to match the proxy's storage order
    address public constraintsLogicContract;

    mapping(address => mapping(uint => uint)) userList;

	function editUserList(address user, uint key, uint value) public returns (bool) {
	    userList[user][key] = value;
        return true;
	}

	function getUserListEntry(address user, uint key) public view returns(uint value) {
	    return userList[user][key];
	}

    function check(address _from, address _to, uint256 _value) public pure returns (bool authorized)  {
        return true;
    }

}