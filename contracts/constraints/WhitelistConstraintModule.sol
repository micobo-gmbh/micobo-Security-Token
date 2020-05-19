pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";


contract WhitelistConstraintModule is IConstraintModule {
	ISecurityToken _securityToken;

	bytes32 private _module_name = keccak256("WHITELIST");

	// module data
	mapping(address => bool) private _whitelist;

	// TODO maybe change to canSend and can Receive

	constructor(address tokenAddress) public {
		_securityToken = ISecurityToken(tokenAddress);
	}

	function isWhitelisted(address account) public view returns (bool) {
		return _whitelist[account];
	}

	// function editWhitelist
	function editWhitelist(address account, bool whitelisted) public {
		require(_securityToken.hasRole(bytes32("WHITELIST_EDITOR"), msg.sender), "A8");
		_whitelist[account] = whitelisted;
	}

	// function bulkEditWhitelist
	function bulkEditWhitelist(address[] memory accounts, bool whitelisted) public {
		require(_securityToken.hasRole(bytes32("WHITELIST_EDITOR"), msg.sender), "A8");

		for (uint256 i = 0; i < accounts.length; i++) {
			_whitelist[accounts[i]] = whitelisted;
		}
	}

	function executeTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external override returns (bool, string memory) {
		(bool valid, , , string memory reason) = validateTransfer(
			msg_sender,
			partition,
			operator,
			from,
			to,
			value,
			data,
			operatorData
		);

		return (valid, reason);
	}

	function validateTransfer(
		address, /* msg_sender */
		bytes32, /* partition */
		address, /* operator */
		address from,
		address to,
		uint256, /* value */
		bytes memory, /* data */
		bytes memory /* operatorData */
	)
		public
		override
		view
		returns (
			bool valid,
			bytes1 code,
			bytes32 extradata,
			string memory reason
		)
	{
		if (_whitelist[from] && _whitelist[to]) {
			return (true, code, extradata, "");
		} else if (!_whitelist[from]) {
			return (false, hex"A8", "", "A8 - sender not whitelisted");
		} else {
			return (false, hex"A8", "", "A8 - recipient not whitelisted");
		}
	}

	// VIEW

	function getModuleName() public override view returns (bytes32) {
		return _module_name;
	}
}
