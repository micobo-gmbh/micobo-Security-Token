pragma solidity 0.5.0;

interface ConstraintsInterface {

    event AdminLogicUpdate(address msg_sender, address newLogic);

    event UserListEdit(address msg_sender, address indexed user, uint indexed key, uint value);
    event Authorised(address indexed msg_sender, address indexed from, address indexed to, uint256 value);

    function editUserList(address user, uint key, uint value) external;

    function getUserListEntry(address user, uint key) external view returns (uint value);

    function check(
        address _msg_sender,
        address _from,
        address _to,
        uint256 _value
    )
        external
        returns (bool authorized, string memory message);
}