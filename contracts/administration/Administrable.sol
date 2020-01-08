pragma solidity 0.5.0;

import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract Administrable is GSNRecipient, ReentrancyGuard {

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
     * 6 CONSTRAINTS_EDITOR (can edit constraint modules),
     * 7 DOCUMENT_EDITOR
     *
     * constraints_editor: simply use new roles in every constraint module!
     */

    /**
     * @title _roles
     * @dev mapping for managing addresses assigned to a role.
     * cannot be changed, just like _administrationLogic
     */
    mapping(uint8 => mapping(address => bool)) internal _roles;

    // Array of controllers. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    // @dev We only ADD role 0 holders to this Array. Look up entries to see if they are still CONTROLLER
    address[] internal _controllers;

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
        require(hasRole(role, _msgSender()), 'sender does not have necessary role');
        _;
    }

    constructor (address[] memory controllers) public {
        for (uint i = 0; i < controllers.length; i++) {
            _add(1, controllers[i]);
        }
        _controllers = controllers;
    }

    /**
     * @param role role that is being assigned
     * @param account the address that is being assigned a role
     * @dev Assigns a role to an account
     * only ADMIN
     */
    function addRole(uint8 role, address account) onlyRole(0) public {
        _add(role, account);
    }

    /**
     * @param role role that is being removed
     * @param account the address that a role is removed from
     * @dev Removes a role from an account
     * only ADMIN
     */
    function removeRole(uint8 role, address account) onlyRole(0) public {
        _remove(role, account);
    }

    /**
     * @param role role that is being renounced by the msg.sender
     * @dev Removes a role from the sender's address
     */
    function renounceRole(uint8 role) public {
        require(hasRole(role, _msgSender()), 'sender does not have this role');

        _remove(role, _msgSender());

        emit RoleRenounced(role, _msgSender());
    }

    /**
     * @dev give an account access to a role
     */
    function _add(uint8 role, address account) internal {
        require(account != address(0), 'zero address');
        require(!hasRole(role, account), 'account already has this role');

        // we only add here, controllers view function checks for entry validity
        if (role == 1) {
            _controllers.push(account);
        }

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
            !(role == 0 && account == _msgSender()),
            'cannot remove your own ADMIN role'
        );
        require(hasRole(role, account), 'account does not have this role');

        _roles[role][account] = false;

        emit RoleRemoved(role, account);
    }

    /**
     * @dev check if an account has a role
     * @return bool
     */
    function hasRole(uint8 role, address account) public view returns (bool) {
        require(account != address(0), 'zero address');
        return _roles[role][account];
    }


    // GSN

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external view returns (uint256, bytes memory) {
        // TODO zero means accepting --> add some constraints
        return(0, "");
    }

    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
        return "";
    }

    function _postRelayedCall(bytes memory context, bool success, uint256 actualCharge, bytes32 preRetVal) internal {

    }
}
