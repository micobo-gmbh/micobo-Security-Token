pragma solidity ^0.5.9;

contract IAdmin {

    function addRole(uint8 role, address account) external;

    function removeRole(uint8 role, address account) external;

    function renounceRole(uint8 role) external;

    function hasRole(uint8 role, address account) external view returns (bool);

    event RoleAdded(uint8 indexed role, address indexed account);
    event RoleRemoved(uint8 indexed role, address indexed account);
    event RoleRenounced(uint8 indexed role, address indexed account);
}
