pragma solidity ^0.5.0;

contract ConstraintsInterface {

    address public constraintsLogicContract;

    function editUserList(address user, uint key, uint value) public;

    function getUserListEntry(address user, uint key) public view returns (uint value);

    function check() public returns (bool authorized);

}