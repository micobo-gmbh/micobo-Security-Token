pragma solidity 0.6.6;

import "./Administrable.sol";
import "../interfaces/IConstraintModule.sol";


contract Constrainable is Administrable {
	mapping(bytes32 => IConstraintModule[]) private _modulesByPartition;

	function _executeTransfer(
		address sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	) internal {
		for (uint256 i = 0; i < _modulesByPartition[partition].length; i++) {
			(bool valid, string memory reason) = _modulesByPartition[partition][i].executeTransfer(
				sender,
				partition,
				operator,
				from,
				to,
				value,
				data,
				operatorData
			);

			require(valid, reason);
		}
	}

	function _validateTransfer(
		address sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	)
		internal
		view
		returns (
			bool valid,
			bytes1 code,
			bytes32 extradata,
			string memory reason
		)
	{
		for (uint256 i = 0; i < _modulesByPartition[partition].length; i++) {
			(valid, code, extradata, reason) = _modulesByPartition[partition][i].validateTransfer(
				sender,
				partition,
				operator,
				from,
				to,
				value,
				data,
				operatorData
			);

			if (!valid) {
				return (valid, code, extradata, reason);
			}
		}
		return (true, "", "", "");
	}

	function getModulesByPartition(bytes32 partition) external view returns (IConstraintModule[] memory) {
		return _modulesByPartition[partition];
	}

	function setModulesByPartition(bytes32 partition, IConstraintModule[] calldata newModules) external {
		require(hasRole(bytes32("MODULE_EDITOR"), msg.sender), "A7");
		_modulesByPartition[partition] = newModules;
	}
}
