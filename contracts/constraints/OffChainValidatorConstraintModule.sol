pragma solidity 0.6.6;

import "../interfaces/IConstraintModule.sol";


// import '../interfaces/ISecurityToken.sol';

/**
 * @author Simon Dosch
 * @title OffChainValidator
 * @dev ConstraintModule
 * Validates off-chain validator signature in data field
 */

abstract contract OffChainValidator is IConstraintModule {
	/*
    // TODO this constraint module still has to be implemented

    ISecurityToken private _securityToken;

    address _signer;

    bytes32 private _module_name = bytes32('OFF_CHAIN');

    // module data
    address _signer;

    constructor(
        address tokenAddress,
        string memory module_name,
        address signer
    ) public {
        _module_name = module_name;
        _securityToken = ISecurityToken(tokenAddress);
        _signer = signer;
    }

    // TODO function change signer

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
	/* function executeTransfer(
		address msg_sender,
		bytes32 partition,
		address operator,
		address from,
		address to,
		uint256 value,
		bytes calldata data,
		bytes calldata operatorData
	) external returns (bool valid, string memory reason); */
	/**
	 * @dev Returns module name
	 * @return bytes32 name of the constraint module
	 */
	/* function getModuleName() external view returns (bytes32);
	 */
}
