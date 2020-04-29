
pragma solidity 0.6.6;

/**
 * @title ERC1400 security token standard
 * @dev ERC1400 logic
 */
interface IERC1400Capped  {

    // Capped
    function cap() external view returns (uint256);
    function capByPartition(bytes32 partition) external view returns (uint256);
    function setCapByPartition(bytes32 partition, uint256 newPartitionCap) external;
}
