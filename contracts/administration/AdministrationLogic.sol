pragma solidity 0.5.0;

/*
 * @author Simon Dosch
 * @title The logic contract providing administration functions
 */
contract AdministrationLogic {

    /**
     * @dev this needs to match the master's storage order
     * so it occupies the same storage space
     */
    address private _administrationLogic;

    /**
     * @title _roles
     * @dev mapping for managing addresses assigned to a role.
     * cannot be changed, just like _administrationLogic
     */
    mapping(uint8 => mapping(address => bool)) _roles;

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
     * @dev Enum provides uint8 values corresponding to a Role
     * This is intended to be expanded when updating this contract
     * to hold new Roles for new functionalities
     */
    enum Role {
        ADMIN,
        ADMIN_UPDATER,
        CONSTRAINTS_UPDATER,
        MINTER,
        PAUSER,
        CONSTRAINTS_EDITOR,
        BURNER
    }

    /**
     * @dev Modifier to make a function callable only when the caller is a ADMIN.
     */
    modifier _onlyAdmins() {
        require(_has(uint8(Role.ADMIN), msg.sender), 'only ADMIN allowed');
        _;
    }

    /**
     * @param role role that is being assigned
     * @param account the address that is being assigned a role
     * @dev Assigns a role to an account
     */
    function add(uint8 role, address account) _onlyAdmins public {
        _add(role, account);
    }

    /**
     * @param role role that is being removed
     * @param account the address that a role is removed from
     * @dev Removes a role from an account
     */
    function remove(uint8 role, address account) _onlyAdmins public {
        _remove(role, account);
    }

    /**
     * @param role role that is being renounced by the msg.sender
     * @dev Removes a role from the sender's address
     */
    function renounce(uint8 role) public {
        require(_has(role, msg.sender), 'msg.sender does not have this role');

        _remove(role, msg.sender);

        emit RoleRenounced(role, msg.sender);
    }


    /**
     * @param account address that is being checked
     * @dev check if an address holds the ADMIN role
     */
    function isAdmin(address account) public view returns (bool) {
        return _has(uint8(Role.ADMIN), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the MINTER role
     */
    function isMinter(address account) public view returns (bool) {
        return _has(uint8(Role.MINTER), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the PAUSER role
     */
    function isPauser(address account) public view returns (bool) {
        return _has(uint8(Role.PAUSER), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the CONSTRAINTS_EDITOR role
     */
    function isConstraintsEditor(address account) public view returns (bool) {
        return _has(uint8(Role.CONSTRAINTS_EDITOR), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the CONSTRAINTS_UPDATER role
     */
    function isConstraintsUpdater(address account) public view returns (bool) {
        return _has(uint8(Role.CONSTRAINTS_UPDATER), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the ADMIN_UPDATER role
     */
    function isAdminUpdater(address account) public view returns (bool) {
        return _has(uint8(Role.ADMIN_UPDATER), account);
    }

    /**
     * @param account address that is being checked
     * @dev check if an address holds the BURNER role
     */
    function isBurner(address account) public view returns (bool) {
        return _has(uint8(Role.BURNER), account);
    }


    /**
     * @dev give an account access to a role
     */
    function _add(uint8 role, address account) internal {
        require(account != address(0), 'zero address');
        require(!_has(role, account), 'account already has this role');

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
            !(role == uint8(Role.ADMIN) && account == msg.sender),
            'cannot remove your own ADMIN role'
        );
        require(_has(role, account), 'account does not have this role');

        _roles[role][account] = false;

        emit RoleRemoved(role, account);
    }

    /**
     * @dev check if an account has a role
     * @return bool
     */
    function _has(uint8 role, address account) internal view returns (bool) {
        require(account != address(0), 'zero address');
        return _roles[role][account];
    }
}



