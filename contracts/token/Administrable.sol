pragma solidity 0.5.12;

import "../../node_modules/@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "../../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAdmin.sol";


contract Administrable is IAdmin, GSNRecipient, ReentrancyGuard {

    /**
     * @dev list of standard roles
     * role names and descriptions are managed off-chain
     * this way, roles can be added (i.e. for constraint modules)
     *
     * Traditionally, CONTROLLER can transfer anybody's tokens and set the document
     * we outsource the last one to a new DOCUMENT_EDITOR role
     *
     * 0 ADMIN   (can add and remove roles)
     * 1 CONTROLLER (ERC1400, can move tokens if contract _isControllable),
     * 2 MINTER / ISSUER,
     * 3 PAUSER,
     * 4 BURNER / REDEEMER
     * 5 CAP_EDITOR
     * 6 MODULE_EDITOR (can edit constraint modules),
     * 7 DOCUMENT_EDITOR
     * 8 WHITELIST_EDITOR
     * 9 TIME_LOCK_EDITOR
     *
     */

    mapping(uint8 => mapping(address => bool)) internal _roles;

    // Array of controllers. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    // INFO we use CONTROLLER roles for global controllers instead
    // address[] internal _controllers;

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

    /**
     * @dev Modifier to make a function callable only when the caller is a specific role.
     */
    modifier onlyRole(uint8 role) {
        require(hasRole(role, msg.sender), 'sender does not have necessary role');
        _;
    }


    /**
     * @param role role that is being assigned
     * @param account the address that is being assigned a role
     * @dev Assigns a role to an account
     * only ADMIN
     */
    function addRole(uint8 role, address account) public onlyRole(0) {
        _add(role, account);
    }

    /**
     * @param role role that is being removed
     * @param account the address that a role is removed from
     * @dev Removes a role from an account
     * only ADMIN
     */
    function removeRole(uint8 role, address account) public onlyRole(0) {
        _remove(role, account);
    }

    /**
     * @param role role that is being renounced by the msg.sender
     * @dev Removes a role from the sender's address
     */
    function renounceRole(uint8 role) public {
        require(hasRole(role, msg.sender), 'sender does not have this role');

        _remove(role, msg.sender);

        emit RoleRenounced(role, msg.sender);
    }

    /**
     * @dev check if an account has a role
     * @return bool
     */
    function hasRole(uint8 role, address account) public view returns (bool) {
        require(account != address(0), 'zero address');
        return _roles[role][account];
    }



    /******* INTERNAL FUNCTIONS *******/

    /**
     * @dev give an account access to a role
     */
    function _add(uint8 role, address account) internal {
        require(account != address(0), 'zero address');
        require(!hasRole(role, account), 'account already has this role');

        _roles[role][account] = true;

        emit RoleAdded(role, account);
    }

    /**
     * @dev remove an account's access to a role
     * cannot give zero-address
     * cannot remove own ADMIN role
     * address must have role
     */
    function _remove(uint8 role, address account) internal {
        require(account != address(0), 'zero address');
        require(
            !(role == 0 && account == msg.sender),
            'cannot remove your own ADMIN role'
        );
        require(hasRole(role, account), 'account does not have this role');

        _roles[role][account] = false;

        emit RoleRemoved(role, account);
    }

}
