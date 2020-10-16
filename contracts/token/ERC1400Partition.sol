pragma solidity 0.6.6;

import "./ERC1400Raw.sol";
import "../interfaces/IERC1400Partition.sol";


/**
 * @title ERC1400Partition
 * @dev ERC1400Partition logic
 */
contract ERC1400Partition is IERC1400Partition, ERC1400Raw {
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

	/**
	 * @dev Initialize ERC1400Partition
	 * @param name Name of the token.
	 * @param symbol Symbol of the token.
	 * @param granularity Granularity of the token.
	 */
	function _initializeERC1400Partition(
		string memory name,
		string memory symbol,
		uint256 granularity
	) internal {
		_initializeERC1400Raw(name, symbol, granularity);
	}

	/********************** NEW FUNCTIONS **************************/

	/**
	 * @dev Returns the total supply of a given partition
	 * For ERC20 compatibility via proxy
	 * @param partition Requested partition
	 * @return uint256 _totalSupplyByPartition
	 */
	function totalSupplyByPartition(bytes32 partition)
		public
		override
		view
		returns (uint256)
	{
		return _totalSupplyByPartition[partition];
	}

	/**
	 * @dev Returns all partition proxy addresses
	 * @return address[] Array of all partition proxy addresses
	 */
	function partitionProxies()
		public
		override
		view
		returns (address[] memory)
	{
		return _partitionProxies;
	}

	/********************** ERC1400Partition EXTERNAL FUNCTIONS **************************/

	/**
	 * [ERC1400Partition INTERFACE (1/10)]
	 * @dev Get balance of a tokenholder for a specific partition.
	 * @param partition Name of the partition.
	 * @param tokenHolder Address for which the balance is returned.
	 * @return Amount of token of partition 'partition' held by 'tokenHolder' in the token contract.
	 */
	function balanceOfByPartition(bytes32 partition, address tokenHolder)
		external
		override
		view
		returns (uint256)
	{
		return _balanceOfByPartition[tokenHolder][partition];
	}

	/**
	 * [ERC1400Partition INTERFACE (2/10)]
	 * @dev Get partitions index of a tokenholder.
	 * @param tokenHolder Address for which the partitions index are returned.
	 * @return Array of partitions index of 'tokenHolder'.
	 */
	function partitionsOf(address tokenHolder)
		external
		override
		view
		returns (bytes32[] memory)
	{
		return _partitionsOf[tokenHolder];
	}

	/**
	 * [ERC1400Partition INTERFACE (3/10)]
	 * @dev Transfer tokens from a specific partition.
	 * @param partition Name of the partition.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer, by the token holder.
	 * @return Destination partition.
	 */
	function transferByPartition(
		bytes32 partition,
		address to,
		uint256 value,
		bytes calldata data
	) external override returns (bytes32) {
		return
			_transferByPartition(
				partition,
				_msgSender(),
				_msgSender(),
				to,
				value,
				data,
				""
			);
	}

	/**
	 * [ERC1400Partition INTERFACE (4/10)]
	 * @dev Transfer tokens from a specific partition through an operator.
	 * @param partition Name of the partition.
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer.
	 * @param operatorData Information attached to the transfer, by the operator.
	 * @return Destination partition.
	 */
	function operatorTransferByPartition(
		bytes32 partition,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external override returns (bytes32) {
		require(
			_isOperatorForPartition(partition, _msgSender(), from),
			"!CONTROLLER or !operator"
		);
		// Transfer Blocked - Identity restriction

		return
			_transferByPartition(
				partition,
				_msgSender(),
				from,
				to,
				value,
				data,
				operatorData
			);
	}

	/**
	 * [ERC1400Partition INTERFACE (7/10)]
	 * @dev Get controllers for a given partition.
	 * Function used for ERC1400Raw and ERC20 backwards compatibility.
	 * @param partition Name of the partition.
	 * @return Array of controllers for partition.
	 */
	function controllersByPartition(bytes32 partition)
		external
		override
		view
		returns (address[] memory)
	{
		return _controllersByPartition[partition];
	}

	/**
	 * [ERC1400Partition INTERFACE (8/10)]
	 * @dev Set 'operator' as an operator for 'msg.sender' for a given partition.
	 * @param partition Name of the partition.
	 * @param operator Address to set as an operator for 'msg.sender'.
	 */
	function authorizeOperatorByPartition(bytes32 partition, address operator)
		external
		override
	{
		_authorizedOperatorByPartition[_msgSender()][partition][operator] = true;
		emit AuthorizedOperatorByPartition(partition, operator, _msgSender());
	}

	/**
	 * [ERC1400Partition INTERFACE (9/10)]
	 * @dev Remove the right of the operator address to be an operator on a given
	 * partition for 'msg.sender' and to transfer and redeem tokens on its behalf.
	 * @param partition Name of the partition.
	 * @param operator Address to rescind as an operator on given partition for 'msg.sender'.
	 */
	function revokeOperatorByPartition(bytes32 partition, address operator)
		external
		override
	{
		_authorizedOperatorByPartition[_msgSender()][partition][operator] = false;
		emit RevokedOperatorByPartition(partition, operator, _msgSender());
	}

	/**
	 * [ERC1400Partition INTERFACE (10/10)]
	 * @dev Indicate whether the operator address is an operator of the tokenHolder
	 * address for the given partition.
	 * @param partition Name of the partition.
	 * @param operator Address which may be an operator of tokenHolder for the given partition.
	 * @param tokenHolder Address of a token holder which may have the operator address as an operator for the given partition.
	 * @return 'true' if 'operator' is an operator of 'tokenHolder' for partition 'partition' and 'false' otherwise.
	 */
	function isOperatorForPartition(
		bytes32 partition,
		address operator,
		address tokenHolder
	) external override view returns (bool) {
		return _isOperatorForPartition(partition, operator, tokenHolder);
	}

	/********************** ERC1400Partition INTERNAL FUNCTIONS **************************/

	/**
	 * [INTERNAL]
	 * @dev Indicate whether the operator address is an operator of the tokenHolder
	 * address for the given partition.
	 * @param partition Name of the partition.
	 * @param operator Address which may be an operator of tokenHolder for the given partition.
	 * @param tokenHolder Address of a token holder which may have the operator address as an operator for the given partition.
	 * @return 'true' if 'operator' is an operator of 'tokenHolder' for partition 'partition' and 'false' otherwise.
	 */
	function _isOperatorForPartition(
		bytes32 partition,
		address operator,
		address tokenHolder
	) internal view returns (bool) {
		return (_authorizedOperatorByPartition[tokenHolder][partition][operator] ||
			(_isControllable &&
				(_isControllerByPartition[partition][operator] ||
					hasRole(bytes32("CONTROLLER"), operator))));
		// INFO we use _isControllerByPartition only for partitionProxy
		// renouncing control kills erc20 proxy contracts
	}

	/**
	 * [INTERNAL]
	 * @dev Transfer tokens from a specific partition.
	 * @param fromPartition Partition of the tokens to transfer.
	 * @param operator The address performing the transfer.
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer. [CAN CONTAIN THE DESTINATION PARTITION]
	 * @param operatorData Information attached to the transfer, by the operator (if any).
	 * @return Destination partition.
	 */
	function _transferByPartition(
		bytes32 fromPartition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	) internal returns (bytes32) {
		require(
			_balanceOfByPartition[from][fromPartition] >= value,
			"insufficient funds"
		);
		// Transfer Blocked - Sender balance insufficient

		// The RIVER Principle
		// all transaction go to base partition by default
		// so over time, tokens converge towards the base!
		bytes32 toPartition = bytes32(0);

		if (operatorData.length != 0 && data.length >= 64) {
			toPartition = _getDestinationPartition(fromPartition, data);
		}

		_removeTokenFromPartition(from, fromPartition, value);
		_transferWithData(
			fromPartition,
			operator,
			from,
			to,
			value,
			data,
			operatorData
		);
		_addTokenToPartition(to, toPartition, value);

		emit TransferByPartition(
			fromPartition,
			operator,
			from,
			to,
			value,
			data,
			operatorData
		);

		if (toPartition != fromPartition) {
			emit ChangedPartition(fromPartition, toPartition, value);
		}

		return toPartition;
	}

	/**
	 * [INTERNAL]
	 * @dev Remove a token from a specific partition.
	 * @param from Token holder.
	 * @param partition Name of the partition.
	 * @param value Number of tokens to transfer.
	 */
	function _removeTokenFromPartition(
		address from,
		bytes32 partition,
		uint256 value
	) internal {
		_balanceOfByPartition[from][partition] = _balanceOfByPartition[from][partition]
			.sub(value);
		_totalSupplyByPartition[partition] = _totalSupplyByPartition[partition]
			.sub(value);

		// If the total supply is zero, finds and deletes the partition.
		if (_totalSupplyByPartition[partition] == 0) {
			uint256 index1 = _indexOfTotalPartitions[partition];
			require(index1 > 0, "last partition");
			// Transfer Blocked - Token restriction

			// move the last item into the index being vacated
			bytes32 lastValue = _totalPartitions[_totalPartitions.length - 1];
			_totalPartitions[index1 - 1] = lastValue;
			// adjust for 1-based indexing
			_indexOfTotalPartitions[lastValue] = index1;

			_totalPartitions.pop();
			_indexOfTotalPartitions[partition] = 0;
		}

		// If the balance of the TokenHolder's partition is zero, finds and deletes the partition.
		if (_balanceOfByPartition[from][partition] == 0) {
			uint256 index2 = _indexOfPartitionsOf[from][partition];
			require(index2 > 0, "last partition");
			// Transfer Blocked - Token restriction

			// move the last item into the index being vacated
			bytes32 lastValue = _partitionsOf[from][_partitionsOf[from].length -
				1];
			_partitionsOf[from][index2 - 1] = lastValue;
			// adjust for 1-based indexing
			_indexOfPartitionsOf[from][lastValue] = index2;

			_partitionsOf[from].pop();
			_indexOfPartitionsOf[from][partition] = 0;
		}
	}

	/**
	 * [INTERNAL]
	 * @dev Add a token to a specific partition.
	 * @param to Token recipient.
	 * @param partition Name of the partition.
	 * @param value Number of tokens to transfer.
	 */
	function _addTokenToPartition(
		address to,
		bytes32 partition,
		uint256 value
	) internal {
		if (value != 0) {
			if (_indexOfPartitionsOf[to][partition] == 0) {
				_partitionsOf[to].push(partition);
				_indexOfPartitionsOf[to][partition] = _partitionsOf[to].length;
			}
			_balanceOfByPartition[to][partition] = _balanceOfByPartition[to][partition]
				.add(value);

			if (_indexOfTotalPartitions[partition] == 0) {
				_totalPartitions.push(partition);
				_indexOfTotalPartitions[partition] = _totalPartitions.length;
			}
			_totalSupplyByPartition[partition] = _totalSupplyByPartition[partition]
				.add(value);
		}
	}

	/**
	 * [INTERNAL]
	 * @dev Retrieve the destination partition from the 'data' field.
	 * By convention, a partition change is requested ONLY when 'data' starts
	 * with the flag: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
	 * When the flag is detected, the destination tranche is extracted from the
	 * 32 bytes following the flag.
	 * @param fromPartition Partition of the tokens to transfer.
	 * @param data Information attached to the transfer. [CAN CONTAIN THE DESTINATION PARTITION]
	 * @return toPartition Destination partition.
	 */
	function _getDestinationPartition(bytes32 fromPartition, bytes memory data)
		internal
		pure
		returns (bytes32 toPartition)
	{
		/* prettier-ignore */
		bytes32 changePartitionFlag = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

		bytes32 flag;
		assembly {
			flag := mload(add(data, 32))
		}
		if (flag == changePartitionFlag) {
			assembly {
				toPartition := mload(add(data, 64))
			}
		} else {
			toPartition = fromPartition;
		}
	}

	/********************* ERC1400Partition OPTIONAL FUNCTIONS ***************************/

	/**
	 * [NOT MANDATORY FOR ERC1400Partition STANDARD]
	 * @dev Get list of existing partitions.
	 * @return Array of all exisiting partitions.
	 */
	function totalPartitions()
		external
		override
		view
		returns (bytes32[] memory)
	{
		return _totalPartitions;
	}

	/**
	 * [NOT MANDATORY FOR ERC1400Partition STANDARD][SHALL BE CALLED ONLY FROM ERC1400]
	 * @dev Set list of token partition controllers.
	 * @param partition Name of the partition.
	 * @param operators Controller addresses.
	 */
	function _setPartitionControllers(
		bytes32 partition,
		address[] memory operators
	) internal {
		for (
			uint256 i = 0;
			i < _controllersByPartition[partition].length;
			i++
		) {
			_isControllerByPartition[partition][_controllersByPartition[partition][i]] = false;
		}
		for (uint256 j = 0; j < operators.length; j++) {
			_isControllerByPartition[partition][operators[j]] = true;
		}
		_controllersByPartition[partition] = operators;
	}

	/************** ERC1400Raw BACKWARDS RETROCOMPATIBILITY *************************/

	/**
	 * @dev Transfer the amount of tokens from the address 'msg.sender' to the address 'to'.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer, by the token holder.
	 */
	function transferWithData(
		address to,
		uint256 value,
		bytes calldata data
	) external override {
		_transferFromTotalPartitions(
			_msgSender(),
			_msgSender(),
			to,
			value,
			data,
			""
		);
	}

	/**
	 * @dev Transfer the amount of tokens on behalf of the address 'from' to the address 'to'.
	 * @param from Token holder (or 'address(0)' to set from to 'msg.sender').
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer, and intended for the token holder ('from').
	 */
	function transferFromWithData(
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external override {
		require(_isOperator(_msgSender(), from), "!operator");

		_transferFromTotalPartitions(
			_msgSender(),
			from,
			to,
			value,
			data,
			operatorData
		);
	}

	/**
	 * [NOT MANDATORY FOR ERC1400Partition STANDARD]
	 * @dev Transfer tokens from all partitions.
	 * @param operator The address performing the transfer.
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer, and intended for the token holder ('from') [CAN CONTAIN THE DESTINATION PARTITION].
	 * @param operatorData Information attached to the transfer by the operator (if any).
	 */
	function _transferFromTotalPartitions(
		address operator,
		address from,
		address to,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	) internal {
		require(_totalPartitions.length != 0, "no partitions"); // Transfer Blocked - Token restriction

		uint256 _remainingValue = value;
		uint256 _localBalance;

		for (uint256 i = 0; i < _totalPartitions.length; i++) {
			_localBalance = _balanceOfByPartition[from][_totalPartitions[i]];
			if (_remainingValue <= _localBalance) {
				_transferByPartition(
					_totalPartitions[i],
					operator,
					from,
					to,
					_remainingValue,
					data,
					operatorData
				);
				_remainingValue = 0;
				break;
			} else if (_localBalance != 0) {
				_transferByPartition(
					_totalPartitions[i],
					operator,
					from,
					to,
					_localBalance,
					data,
					operatorData
				);
				_remainingValue = _remainingValue - _localBalance;
			}
		}

		require(_remainingValue == 0, "insufficient balance"); // Transfer Blocked - Token restriction
	}
}
