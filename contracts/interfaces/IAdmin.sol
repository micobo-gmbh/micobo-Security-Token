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

/*
* 0 ADMIN   (can add and remove roles)
* 1 CONTROLLER (ERC1400, can move tokens if contract _isControllable),
* 2 MINTER / ISSUER,
* 3 PAUSER,
* 4 BURNER / REDEEMER
* 5 CAP_EDITOR
* 6 CONSTRAINTS_EDITOR (can edit constraint modules),
* 7 DOCUMENT_EDITOR
*/
