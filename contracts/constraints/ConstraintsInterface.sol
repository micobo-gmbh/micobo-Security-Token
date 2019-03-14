pragma solidity ^0.5.0;

interface ConstraintsInterface {

    function editUserList(address user, uint key, uint value) external;

    function getUserListEntry(address user, uint key) external view returns (uint value);

    function check(address _msg_sender, address _from, address _to, uint256 _value) external returns (bool authorized, string memory message);

}