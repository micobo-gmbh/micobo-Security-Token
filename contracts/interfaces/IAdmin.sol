pragma solidity 0.6.6;

interface IAdmin {

    function addRole(uint8 role, address account) external;

    function removeRole(uint8 role, address account) external;

    function renounceRole(uint8 role) external;

    function hasRole(uint8 role, address account) external view returns (bool);

    /**
     * @dev Emitted whenever a new role was assigned to an account
     */
    event RoleAdded(uint8 indexed role, address indexed account);

    /**
     * @dev Emitted whenever a role was taken from an account
     */
    event RoleRemoved(uint8 indexed role, address indexed account);

    /**
     * @dev Emitted whenever an account renounced a role
     */
    event RoleRenounced(uint8 indexed role, address indexed account);
}