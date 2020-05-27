pragma solidity 0.6.6;


interface IConstraintModule {
	// ConstraintModule should also implement an interface to the token they are referring to
	// to call functions like hasRole() from Administrable

	// string private _module_name;

	/**
	 * @dev Validates live transfer. Can modify state
	 * @param msg_sender Sender of this function call
	 * @param partition Partition the tokens are being transferred from
	 * @param from Token holder.
	 * @param to Token recipient.
	 * @param value Number of tokens to transfer.
	 * @param data Information attached to the transfer.
	 * @param operatorData Information attached to the transfer, by the operator.
	 * @return valid transfer is valid
	 * @return reason Why the transfer failed (intended for require statement)
	 */
	function executeTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external returns (bool valid, string memory reason);

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
	function validateTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	)
		external
		view
		returns (
			bool valid,
			bytes1 code,
			bytes32 extradata,
			string memory reason
		);

	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	function getModuleName() external view returns (bytes32);
}
