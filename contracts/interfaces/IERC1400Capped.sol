/*
 * This code has not been reviewed.
 * Do not use or deploy this code before reviewing it personally first.
 */
pragma solidity 0.6.6;

/**
 * @title ERC1400 security token standard
 * @dev ERC1400 logic
 */
interface IERC1400Capped  {

    // Document Management
    function getDocument(bytes32 documentName) external view returns (string memory, bytes32); // 1/9
    function setDocument(bytes32 documentName, string calldata uri, bytes32 documentHash) external; // 2/9
    event Document(bytes32 indexed documentName, string uri, bytes32 documentHash);

    // Controller Operation
    function isControllable() external view returns (bool); // 3/9

    // Token Issuance
    function isIssuable() external view returns (bool); // 4/9
    function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data) external; // 5/9
    event IssuedByPartition(
        bytes32 indexed partition,
        address indexed operator,
        address indexed to, uint256 value,
        bytes data, bytes operatorData
    );

    // Token Redemption
    // function redeemByPartition(bytes32 partition, uint256 value, bytes calldata data) external; // 6/9
    function operatorRedeemByPartition(
        bytes32 partition,
        address tokenHolder,
        uint256 value,
        bytes calldata data,
        bytes calldata operatorData
    ) external; // 7/9

    event RedeemedByPartition(
        bytes32 indexed partition,
        address indexed operator,
        address indexed from,
        uint256 value,
        bytes data,
        bytes operatorData
    );

    // Transfer Validity
    // function canTransferByPartition(bytes32 partition, address to, uint256 value, bytes calldata data) external view returns (byte, bytes32, bytes32); // 8/9
    // function canOperatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external view returns (byte, bytes32, bytes32); // 9/9

    // Optional functions
    function renounceControl() external;
    function renounceIssuance() external;
    function setPartitionControllers(bytes32 partition, address[] calldata operators) external;

    // Capped
    function cap() external view returns (uint256);
    function capByPartition(bytes32 partition) external view returns (uint256);
    function setCapByPartition(bytes32 partition, uint256 newPartitionCap) external;
}
