pragma solidity 0.5.0;

import "./constraints/IConstraintsModule.sol";

/**
 * @title Interface for using the Compliant Token
 * @dev this interface is meant solely for usage with libraries like truffle or web3.js.
 * it is not used by any deployed contract
 *
 * Comments show excerpts or the whole content of functions
 * to better illustrate their inner workings here!
 */

interface ISecurityToken {

    //******************/
    // IERC20 INTERFACE complete
    //******************/

    // ERC1400ERC20
    function decimals() external pure returns(uint8);

    // ERC1400Raw
    function totalSupply() external view returns (uint256);

    // ERC1400Raw
    function balanceOf(address account) external view returns (uint256);

    // ERC1400ERC20
    function transfer(address recipient, uint256 amount) external returns (bool);

    // ERC1400ERC20
    function allowance(address owner, address spender) external view returns (uint256);

    // ERC1400ERC20
    function approve(address spender, uint256 amount) external returns (bool);

    // ERC1400ERC20
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    // ERC1400ERC20
    event Transfer(address indexed from, address indexed to, uint256 value);

    // ERC1400ERC20
    event Approval(address indexed owner, address indexed spender, uint256 value);

    //******************/
    // IERC1400Raw INTERFACE without overridden functions
    //******************/

    function name() external view returns (string memory); // 1/13
    function symbol() external view returns (string memory); // 2/13
    // ERC20 function totalSupply() external view returns (uint256); // 3/13
    // ERC20 function balanceOf(address owner) external view returns (uint256); // 4/13
    function granularity() external view returns (uint256); // 5/13

    function controllers() external view returns (address[] memory); // 6/13
    function authorizeOperator(address operator) external; // 7/13
    function revokeOperator(address operator) external; // 8/13
    function isOperator(address operator, address tokenHolder) external view returns (bool); // 9/13

    event TransferWithData(address indexed operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData);
    event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData);
    event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);

    //******************/
    // IERC1400Partition INTERFACE overriding functions
    //******************/

    // overridden
    function transferWithData(address to, uint256 value, bytes calldata data) external; // 10/13
    // overridden
    function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 11/13

    // also overrides redeem and redeemFrom, but they are overridden again in ERC1400

    //******************/
    // ERC1400Partition INTERFACE

    // Token Information
    function balanceOfByPartition(bytes32 partition, address tokenHolder) external view returns (uint256); // 1/10
    function partitionsOf(address tokenHolder) external view returns (bytes32[] memory); // 2/10

    // Token Transfers
    function transferByPartition(bytes32 partition, address to, uint256 value, bytes calldata data) external returns (bytes32); // 3/10
    function operatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external returns (bytes32); // 4/10

    // Default Partition Management
    function getDefaultPartitions() external view returns (bytes32[] memory); // 5/10
    function setDefaultPartitions(bytes32[] calldata partitions) external; // 6/10

    // Operators
    function controllersByPartition(bytes32 partition) external view returns (address[] memory); // 7/10
    function authorizeOperatorByPartition(bytes32 partition, address operator) external; // 8/10
    function revokeOperatorByPartition(bytes32 partition, address operator) external; // 9/10
    function isOperatorForPartition(bytes32 partition, address operator, address tokenHolder) external view returns (bool); // 10/10

    // Transfer Events
    event TransferByPartition(bytes32 indexed fromPartition, address operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData);

    event ChangedPartition(bytes32 indexed fromPartition, bytes32 indexed toPartition, uint256 value);

    // Operator Events
    event AuthorizedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder);
    event RevokedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder);


    //******************/
    // ERC1400 INTERFACE plus overriding functions
    //******************/

    // overridden
    function redeem(uint256 value, bytes calldata data) external; // 12/13
    // overridden
    function redeemFrom(address from, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 13/13

    //******************/
    // ERC1400 INTERFACE

    // Document Management
    function getDocument(bytes32 name) external view returns (string memory, bytes32); // 1/9
    function setDocument(bytes32 name, string calldata uri, bytes32 documentHash) external; // 2/9
    event Document(bytes32 indexed name, string uri, bytes32 documentHash);

    // Controller Operation
    function isControllable() external view returns (bool); // 3/9

    // Token Issuance
    function isIssuable() external view returns (bool); // 4/9
    function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data) external; // 5/9
    event IssuedByPartition(bytes32 indexed partition, address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData);

    // Token Redemption
    function redeemByPartition(bytes32 partition, uint256 value, bytes calldata data) external; // 6/9
    function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 7/9
    event RedeemedByPartition(bytes32 indexed partition, address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData);

    // Transfer Validity
    function canTransferByPartition(bytes32 partition, address to, uint256 value, bytes calldata data) external view returns (byte, bytes32, bytes32); // 8/9
    function canOperatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external view returns (byte, bytes32, bytes32); // 9/9


    //******************/
    // ERC1400ERC20Capped
    //******************/

    function cap() external view returns (uint256);

    function capByPartition(bytes32 partition) external view returns (uint256);

    function setCap(uint256 newCap) external;

    function setCapByPartition(bytes32 partition, uint256 newPartitionCap) external;


    //******************/
    // Administrable INTERFACE
    //******************/

    function addRole(uint8 role, address account) external;
    function removeRole(uint8 role, address account) external;
    function renounceRole(uint8 role) external;

    function hasRole(uint8 role, address account) external view returns (bool);

    event RoleAdded(uint8 indexed role, address indexed account);
    event RoleRemoved(uint8 indexed role, address indexed account);
    event RoleRenounced(uint8 indexed role, address indexed account);


    //******************/
    // Constrainable INTERFACE
    //******************/

    function modules() external view returns (IConstraintsModule[] memory);
    function addModule(IConstraintsModule module) external;
    function removeModule(uint256 index) external; // TODO


    //******************/
    // GSNRecipient INTERFACE
    //******************/

    // TODO configure this

    function getHubAddr() external view returns (address);

    function relayHubVersion() external view returns (string memory);

    function preRelayedCall(bytes calldata context) external returns (bytes32);

    function postRelayedCall(bytes calldata context, bool success, uint256 actualCharge, bytes32 preRetVal) external;
}

