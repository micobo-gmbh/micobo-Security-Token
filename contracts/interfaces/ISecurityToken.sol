pragma solidity 0.6.6;

import "./IConstraintModule.sol";
import "./IAdmin.sol";


/**
 * @title Interface for using the Security Token
 * @dev this interface is meant solely for usage with libraries like truffle or web3.js.
 * it is not used by any deployed contract
 */

interface ISecurityToken {
	function addPartitionProxy(bytes32 partition, address proxyAddress)
		external;

	function bulkIssueByPartition(
		bytes32 partition,
		address[] calldata tokenHolders,
		uint256[] calldata values,
		bytes calldata data
	) external;

	//******************/
	// Constrainable INTERFACE
	//******************/

	function getModulesByPartition()
		external
		view
		returns (IConstraintModule[] memory);

	function setModulesByPartition(
		bytes32 partition,
		IConstraintModule[] calldata newModules
	) external;

	//******************/
	// Administrable INTERFACE
	//******************/
	function addRole(bytes32 role, address account) external;

	function removeRole(bytes32 role, address account) external;

	function renounceRole(bytes32 role) external;

	function hasRole(bytes32 role, address account)
		external
		view
		returns (bool);

	event RoleGranted(
		bytes32 indexed role,
		address indexed account,
		address indexed sender
	);
	event RoleRevoked(
		bytes32 indexed role,
		address indexed account,
		address indexed sender
	);
	event RoleRenounced(bytes32 indexed role, address indexed account);

	//******************/
	// GSNRecipient INTERFACE
	//******************/

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
	) external view returns (uint256, bytes memory);

	function getHubAddr() external view returns (address);

	function relayHubVersion() external view returns (string memory);

	function preRelayedCall(bytes calldata context) external returns (bytes32);

	function postRelayedCall(
		bytes calldata context,
		bool success,
		uint256 actualCharge,
		bytes32 preRetVal
	) external;

	//******************/
	// IERC1400Raw INTERFACE
	//******************/

	function name() external view returns (string memory); // 1/13

	function symbol() external view returns (string memory); // 2/13

	function totalSupply() external view returns (uint256); // 3/13

	function balanceOf(address owner) external view returns (uint256); // 4/13

	function granularity() external view returns (uint256); // 5/13

	// deleted function controllers() external view returns (address[] memory); // 6/13
	// function authorizeOperator(address operator) external; // 7/13
	// function revokeOperator(address operator) external; // 8/13
	// function isOperator(address operator, address tokenHolder) external view returns (bool); // 9/13

	// not necessary for ERC1400Partition
	// function transferWithData(address to, uint256 value, bytes calldata data) external; // 10/13
	// function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 11/13

	// not necessary for ERC1400Partition
	// function redeem(uint256 value, bytes calldata data) external; // 12/13
	// function redeemFrom(address from, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 13/13

	event TransferWithData(
		address indexed operator,
		address indexed from,
		address indexed to,
		uint256 value,
		bytes data,
		bytes operatorData
	);
	event Issued(
		address indexed operator,
		address indexed to,
		uint256 value,
		bytes data,
		bytes operatorData
	);
	event Redeemed(
		address indexed operator,
		address indexed from,
		uint256 value,
		bytes data,
		bytes operatorData
	);
	event AuthorizedOperator(
		address indexed operator,
		address indexed tokenHolder
	);
	event RevokedOperator(
		address indexed operator,
		address indexed tokenHolder
	);

	//******************/
	// ERC1400Partition INTERFACE
	//******************/

	// ERC20 proxy compatibility
	function totalSupplyByPartition(bytes32 partition)
		external
		view
		returns (uint256);

	// Partition proxy contracts
	function partitionProxies() external view returns (address[] memory);

	// Token Information
	function balanceOfByPartition(bytes32 partition, address tokenHolder)
		external
		view
		returns (uint256); // 1/10

	function partitionsOf(address tokenHolder)
		external
		view
		returns (bytes32[] memory); // 2/10

	// Token Transfers
	function transferByPartition(
		bytes32 partition,
		address to,
		uint256 value,
		bytes calldata data
	) external returns (bytes32); // 3/10

	function operatorTransferByPartition(
		bytes32 partition,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external returns (bytes32); // 4/10

	// Operators
	function controllersByPartition(bytes32 partition)
		external
		view
		returns (address[] memory); // 7/10

	function authorizeOperatorByPartition(bytes32 partition, address operator)
		external; // 8/10

	function revokeOperatorByPartition(bytes32 partition, address operator)
		external; // 9/10

	function isOperatorForPartition(
		bytes32 partition,
		address operator,
		address tokenHolder
	) external view returns (bool); // 10/10

	// Optional functions
	function totalPartitions() external view returns (bytes32[] memory);

	// Transfer Events
	event TransferByPartition(
		bytes32 indexed fromPartition,
		address operator,
		address indexed from,
		address indexed to,
		uint256 value,
		bytes data,
		bytes operatorData
	);

	event ChangedPartition(
		bytes32 indexed fromPartition,
		bytes32 indexed toPartition,
		uint256 value
	);

	// Operator Events
	event AuthorizedOperatorByPartition(
		bytes32 indexed partition,
		address indexed operator,
		address indexed tokenHolder
	);
	event RevokedOperatorByPartition(
		bytes32 indexed partition,
		address indexed operator,
		address indexed tokenHolder
	);

	//******************/
	// ERC1400Capped INTERFACE
	//******************/

	// Document Management
	function getDocument(bytes32 documentName)
		external
		view
		returns (string memory, bytes32); // 1/9

	function setDocument(
		bytes32 documentName,
		string calldata uri,
		bytes32 documentHash
	) external; // 2/9

	event Document(
		bytes32 indexed documentName,
		string uri,
		bytes32 documentHash
	);

	// Controller Operation
	function isControllable() external view returns (bool); // 3/9

	// Token Issuance
	function isIssuable() external view returns (bool); // 4/9

	function issueByPartition(
		bytes32 partition,
		address tokenHolder,
		uint256 value,
		bytes calldata data
	) external; // 5/9

	event IssuedByPartition(
		bytes32 indexed partition,
		address indexed operator,
		address indexed to,
		uint256 value,
		bytes data,
		bytes operatorData
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
	function canTransferByPartition(
		bytes32 partition,
		address to,
		uint256 value,
		bytes calldata data
	)
		external
		view
		returns (
			bytes1,
			bytes32,
			bytes32
		); // 8/9

	function canOperatorTransferByPartition(
		bytes32 partition,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	)
		external
		view
		returns (
			bytes1,
			bytes32,
			bytes32
		); // 9/9

	// Optional functions
	function renounceControl() external;

	function renounceIssuance() external;

	function setPartitionControllers(
		bytes32 partition,
		address[] calldata operators
	) external;

	// Capped
	function cap() external view returns (uint256);

	function setCap(uint256 newCap) external;

	// GSN
	function setGSNAllowed(bool allow) external;

	function getGSNAllowed() external view returns (bool);
}
