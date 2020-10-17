pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";


contract SecurityTokenStorage {
	// Administrable
	/**
	 * @dev Contains all the roles mapped to wether an account holds it or not
	 */
	mapping(bytes32 => mapping(address => bool)) internal _roles;

	// Constrainable
	mapping(bytes32 => IConstraintModule[]) internal _modulesByPartition;

	// ERC1400Raw
	string internal _name;
	string internal _symbol;
	uint256 internal _granularity;
	uint256 internal _totalSupply;

	// Indicate whether the token can still be controlled by operators or not anymore.
	bool internal _isControllable;

	/**
	 * @dev Indicates the paused state
	 */
	bool internal _paused;

	// Mapping from tokenHolder to balance.
	mapping(address => uint256) internal _balances;

	// Mapping from (operator, tokenHolder) to authorized status. [TOKEN-HOLDER-SPECIFIC]
	mapping(address => mapping(address => bool)) internal _authorizedOperator;

	// ERC1400Partition
	/******************** Mappings to find partition ******************************/

	// List of partitions.
	bytes32[] internal _totalPartitions;

	// Mapping from partition to their index.
	mapping(bytes32 => uint256) internal _indexOfTotalPartitions;

	// Mapping from partition to global balance of corresponding partition.
	mapping(bytes32 => uint256) internal _totalSupplyByPartition;

	// Mapping from tokenHolder to their partitions.
	mapping(address => bytes32[]) internal _partitionsOf;

	// Mapping from (tokenHolder, partition) to their index.
	mapping(address => mapping(bytes32 => uint256)) internal _indexOfPartitionsOf;

	// Mapping from (tokenHolder, partition) to balance of corresponding partition.
	mapping(address => mapping(bytes32 => uint256)) internal _balanceOfByPartition;

	/****************************************************************************/

	/**************** Mappings to find partition operators ************************/
	// Mapping from (tokenHolder, partition, operator) to 'approved for partition' status. [TOKEN-HOLDER-SPECIFIC]
	mapping(address => mapping(bytes32 => mapping(address => bool))) internal _authorizedOperatorByPartition;

	// Mapping from partition to controllers for the partition. [NOT TOKEN-HOLDER-SPECIFIC]
	mapping(bytes32 => address[]) internal _controllersByPartition;

	// --> we can leave this here, partition controllers can be set by the admin just like other roles
	// Mapping from (partition, operator) to PartitionController status. [NOT TOKEN-HOLDER-SPECIFIC]
	mapping(bytes32 => mapping(address => bool)) internal _isControllerByPartition;
	/****************************************************************************/

	address[] internal _partitionProxies;

	// ERC1400ERC20
	/**
	 * @dev Mapping from (tokenHolder, spender) to allowed value.
	 */
	mapping(address => mapping(address => uint256)) internal _allowances;

	//******************/
	// ERC1400
	//******************/

	struct Doc {
		string docURI;
		bytes32 docHash;
	}

	// Mapping for token URIs.
	mapping(bytes32 => Doc) internal _documents;

	// Indicate whether the token can still be issued by the issuer or not anymore.
	bool internal _isIssuable;

	/************** CAPPED *******************/
	uint256 internal _cap;

	/*************  OWNABLE ******************/
	address internal _owner;
}
