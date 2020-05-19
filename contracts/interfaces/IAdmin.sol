pragma solidity 0.6.6;


interface IAdmin {
	function addRole(bytes32 role, address account) external;

	function removeRole(bytes32 role, address account) external;

	function renounceRole(bytes32 role) external;

	function hasRole(bytes32 role, address account) external view returns (bool);

	/**
	 * @dev Emitted when `account` is granted `role`.
	 *
	 * `sender` is the account that originated the contract call, an admin role
	 * bearer except when using {_setupRole}.
	 */
	event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

	/**
	 * @dev Emitted when `account` is revoked `role`.
	 *
	 * `sender` is the account that originated the contract call:
	 *   - if using `revokeRole`, it is the admin role bearer
	 *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
	 */
	event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

	/**
	 * @dev Emitted whenever an account renounced a role
	 */
	event RoleRenounced(bytes32 indexed role, address indexed account);
}
