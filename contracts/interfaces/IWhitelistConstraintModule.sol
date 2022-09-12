// SPDX-License-Identifier: MIT

pragma solidity >=0.6.6;

import "./IConstraintModule.sol";

interface IWhitelistConstraintModule is IConstraintModule {
	function isWhitelisted(address account) external view returns (bool);

	function editWhitelist(address account, bool whitelisted) external;

	function bulkEditWhitelist(address[] calldata accounts, bool whitelisted)
		external;
}
