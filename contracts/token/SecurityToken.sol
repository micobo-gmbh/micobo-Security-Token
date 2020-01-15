pragma solidity 0.5.9;

import "./ERC1400Capped.sol";

/**
 * @author openzeppelin
 * @title Capped token
 * @dev token with a total cap and partition specific caps.
 * Cap cannot be changed afterwards.
 */
contract SecurityToken is ISecurityToken, ERC1400Capped {

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */

    // TODO maybe re-add the defaultPartitions (as initialPartitions)
    // seems to inflate the contract size by a lot!

    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity,
        address adminContract
    )
    public
    ERC1400Capped(name, symbol, granularity, adminContract)
    {

    }


    // add a new Partition proxy contract
    function addPartition(bytes32 partition, uint256 partitionCap) public{
        require(_admin.hasRole(0, _msgSender()));

        SecurityTokenPartition newPartition = new SecurityTokenPartition(address(this), partition);

        setCapByPartition(partition, partitionCap);

        _partitionProxies.push(newPartition);
    }


    // GSN ***********************************

    function acceptRelayedCall(
        address /*relay*/,
        address /*from*/,
        bytes calldata /*encodedFunction*/,
        uint256 /*transactionFee*/,
        uint256 /*gasPrice*/,
        uint256 /*gasLimit*/,
        uint256 /*nonce*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxPossibleCharge*/
    ) external view returns (uint256, bytes memory) {
        // TODO zero means accepting --> add some constraints
        return (0, "");
    }

    function _preRelayedCall(bytes memory /*context*/) internal returns (bytes32) {
        return "";
    }

    function _postRelayedCall(
        bytes memory /*context*/,
        bool /*success*/,
        uint256 /*actualCharge*/,
        bytes32 /*preRetVal*/
    ) internal {

    }
}
