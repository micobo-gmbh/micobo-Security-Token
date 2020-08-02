pragma solidity 0.6.6;

import "./Administrable.sol";
import "../interfaces/IConstraintModule.sol";
import "../interfaces/IConstrainable.sol";


/**
 * @author Simon Dosch
 * @title Constrainable
 * @dev Adds transfer constraints in the form of updatable constraint modules
 */
contract Constrainable is IConstrainable, Administrable {
	mapping(bytes32 => IConstraintModule[]) private _modulesByPartition;

	/**
	 * @dev Validates live transfer. Can modify state
	 * @param msg_sender Sender of this function call
	 * @param partition Partition the tokens are being transferred from
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer.
	 * @param operatorData Information attached to the transfer, by the operator
	 */
	function _executeTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	) internal {
		for (uint256 i = 0; i < _modulesByPartition[partition].length; i++) {
			(
				bool valid,
				string memory reason
			) = _modulesByPartition[partition][i].executeTransfer(
				msg_sender,
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

	/**
	 * @dev Validates transfer. Cannot modify state
	 * @param msg_sender Sender of this function call
	 * @param partition Partition the tokens are being transferred from
	 * @param operator Address of operator or controller who initiated the transfer
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer.
	 * @param operatorData Information attached to the transfer, by the operator.
	 * @return valid transfer is valid
	 * @return code ERC1066 error code
	 * @return extradata Additional bytes32 parameter that can be used to define
	 * application specific reason codes with additional details (for example the
	 * transfer restriction rule responsible for making the transfer operation invalid).
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function _validateTransfer(
		address msg_sender,
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
			(valid, code, extradata, reason) = _modulesByPartition[partition][i]
				.validateTransfer(
				msg_sender,
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

	/**
	 * @dev Returns all modules for requested partition
	 * @param partition Partition to get modules for
	 * @return IConstraintModule[]
	 */
	function getModulesByPartition(bytes32 partition)
		external
		override
		view
		returns (IConstraintModule[] memory)
	{
		return _modulesByPartition[partition];
	}

	/**
	 * @dev Sets all modules for partition
	 * @param partition Partition to set modules for
	 * @param newModules IConstraintModule[] array of new modules for this partition
	 */
	function setModulesByPartition(
		bytes32 partition,
		IConstraintModule[] calldata newModules
	) external override {
		require(hasRole(bytes32("MODULE_EDITOR"), _msgSender()), "A7");
		_modulesByPartition[partition] = newModules;
		emit ModulesByPartitionSet(_msgSender(), partition, newModules);
	}
}
