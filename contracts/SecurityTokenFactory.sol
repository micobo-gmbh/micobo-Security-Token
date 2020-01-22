pragma solidity 0.5.12;

/*
import './interfaces/ISecurityToken.sol';
import './token/SecurityTokenPartition.sol';

contract SecurityTokenPartitionFactory {

    function createPartition(
        address securityTokenAddress,
        bytes32 partition,
        uint256 partitionCap
    )
    public
    returns (SecurityTokenPartition tokenPartition) {
        tokenPartition = new SecurityTokenPartition(
            securityTokenAddress,
            partition
        );

        // TODO this will lead to problems with _msgSender() !

        ISecurityToken(securityTokenAddress).addPartition(
            partition,
            address(tokenPartition),
            partitionCap
        );

        return tokenPartition;
    }
} */