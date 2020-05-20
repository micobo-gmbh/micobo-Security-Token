pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";


interface IConstrainable {
	function getModulesByPartition(bytes32 partition) external view returns (IConstraintModule[] memory);

	function setModulesByPartition(bytes32 partition, IConstraintModule[] calldata newModules) external;
}
