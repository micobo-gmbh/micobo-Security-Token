pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAdmin.sol";
import "../gsn/GSNable.sol";


/**
 * @author Simon Dosch
 * @title Administrable
 * @dev Manages roles for inheriting contracts
 */
contract Administrable is IAdmin, GSNable, ReentrancyGuard {
	/**
     * @dev list of standard roles
     * roles can be added (i.e. for constraint modules)
     *
     * --main roles--
     * ADMIN   (can add and remove roles)
     * CONTROLLER (ERC1400, can force-transfer tokens if contract _isControllable)
     * ISSUER (ISSUER)
     * REDEEMER (BURNER, can redeem tokens, their own OR others IF _isOperatorForPartition())
     * MODULE_EDITOR (can edit constraint modules),
     *
     * --additional roles--
     * DOCUMENT_EDITOR
     * CAP_EDITOR

     * --constraint module roles--
     * PAUSER
     * WHITELIST_EDITOR
     * TIME_LOCK_EDITOR
     * SPENDING_LIMITS_EDITOR
     * VESTING_PERIOD_EDITOR
     * GSN_CONTROLLER
     * DEFAULT_PARTITIONS_EDITOR
	 *
	 * ...
     */

	/**
	 * @dev Contains all the roles mapped to wether an account holds it or not
	 */
	mapping(bytes32 => mapping(address => bool)) internal _roles;

	// EVENTS in IAdmin.sol

	/**
	 * @dev Modifier to make a function callable only when the caller is a specific role.
	 */
	modifier onlyRole(bytes32 role) {
		require(hasRole(role, _msgSender()), "A7");
		_;
	}

	/**
	 * @param role Role that is being assigned
	 * @param account The address that is being assigned a role
	 * @dev Assigns a role to an account
	 * only ADMIN
	 */
	function addRole(bytes32 role, address account)
		public
		override
		onlyRole(bytes32("ADMIN"))
	{
		_add(role, account);
	}

	/**
	 * @param role Role that is being removed
	 * @param account The address that a role is removed from
	 * @dev Removes a role from an account
	 * only ADMIN
	 */
	function removeRole(bytes32 role, address account)
		public
		override
		onlyRole(bytes32("ADMIN"))
	{
		_remove(role, account);
	}

	/**
	 * @param role Role that is being renounced by the _msgSender()
	 * @dev Removes a role from the sender's address
	 * ATTENTION: it is possible to remove the last ADMINN role by renouncing it!
	 */
	function renounceRole(bytes32 role) public override {
		require(hasRole(role, _msgSender()), "A7");

		_remove(role, _msgSender());

		emit RoleRenounced(role, _msgSender());
	}

	/**
	 * @dev check if an account has a role
	 * @return bool True if account has role
	 */
	function hasRole(bytes32 role, address account)
		public
		override
		view
		returns (bool)
	{
		return _roles[role][account];
	}

	/******* INTERNAL FUNCTIONS *******/

	/**
	 * @dev give an account access to a role
	 */
	function _add(bytes32 role, address account) internal {
		require(!hasRole(role, account), "A7");

		_roles[role][account] = true;

		emit RoleGranted(role, account, _msgSender());
	}

	/**
	 * @dev remove an account's access to a role
	 * cannot remove own ADMIN role
	 * address must have role
	 */
	function _remove(bytes32 role, address account) internal {
		require(hasRole(role, account), "A7");

		_roles[role][account] = false;

		emit RoleRevoked(role, account, _msgSender());
	}
}
