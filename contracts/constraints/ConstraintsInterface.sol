pragma solidity ^0.5.0;

contract ConstraintsInterface {

    address public constraintsLogicContract;

    function editUserList(address user, uint key, uint value) public;

    function getUserListEntry(address user, uint key) public view returns (uint value);

    function check(address _msg_sender, address _from, address _to, uint256 _value) public returns (bool authorized, string memory message);

}