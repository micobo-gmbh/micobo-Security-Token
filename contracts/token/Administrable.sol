pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAdmin.sol";
import "../gsn/GSNable.sol";

contract Administrable is IAdmin, GSNable, ReentrancyGuard {

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
     * 2 ISSUER (ISSUER)
     * 3 PAUSER
     * 4 REDEEMER (REDEEMER)
     * 5 CAP_EDITOR
     * 6 MODULE_EDITOR (can edit constraint modules),
     * 7 DOCUMENT_EDITOR
     * 8 WHITELIST_EDITOR
     * 9 TIME_LOCK_EDITOR
     * 10 SPENDING_LIMITS_EDITOR
     * 11 VESTING_PERIOD_EDITOR
     * 12 GSN_CONTROLLER
     */

    mapping(bytes32 => mapping(address => bool)) internal _roles;

    // Array of controllers. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    // INFO we use CONTROLLER roles for global controllers instead
    // address[] internal _controllers;

    // EVENTS in IAdmin.sol

    /**
     * @dev Modifier to make a function callable only when the caller is a specific role.
     */
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, _msgSender()), 'sender does not have necessary role');
        _;
    }


    /**
     * @param role role that is being assigned
     * @param account the address that is being assigned a role
     * @dev Assigns a role to an account
     * only ADMIN
     */
    function addRole(bytes32 role, address account) public override onlyRole(bytes32("ADMIN")) {
        _add(role, account);
    }

    /**
     * @param role role that is being removed
     * @param account the address that a role is removed from
     * @dev Removes a role from an account
     * only ADMIN
     */
    function removeRole(bytes32 role, address account) public override onlyRole(bytes32("ADMIN")) {
        _remove(role, account);
    }

    /**
     * @param role role that is being renounced by the _msgSender()
     * @dev Removes a role from the sender's address
     */
    function renounceRole(bytes32 role) public override {
        require(hasRole(role, _msgSender()), 'sender does not have this role');

        _remove(role, _msgSender());

        emit RoleRenounced(role, _msgSender());
    }

    /**
     * @dev check if an account has a role
     * @return bool
     */
    function hasRole(bytes32 role, address account) public override view returns (bool) {
        require(account != address(0), 'zero address');
        return _roles[role][account];
    }



    /******* INTERNAL FUNCTIONS *******/

    /**
     * @dev give an account access to a role
     */
    function _add(bytes32 role, address account) internal {
        require(account != address(0), 'zero address');
        require(!hasRole(role, account), 'account already has this role');

        _roles[role][account] = true;

        emit RoleGranted(role, account, _msgSender());
    }

    /**
     * @dev remove an account's access to a role
     * cannot give zero-address
     * cannot remove own ADMIN role
     * address must have role
     */
    function _remove(bytes32 role, address account) internal {
        require(account != address(0), 'zero address');
        require(
            !(role == bytes32("ADMIN") && account == _msgSender()),
            'cannot remove your own ADMIN role'
        );
        require(hasRole(role, account), 'account does not have this role');

        _roles[role][account] = false;

        emit RoleRevoked(role, account, _msgSender());
    }

}
