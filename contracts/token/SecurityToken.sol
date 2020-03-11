pragma solidity 0.5.12;

import "./ERC1400Capped.sol";
import "../interfaces/ISecurityToken.sol";

/**
 * @author openzeppelin
 * @title Capped token
 * @dev token with a total cap and partition specific caps.
 * Cap cannot be changed afterwards.
 */
contract SecurityToken is ISecurityToken, ERC1400Capped {

    // TODO maybe re-add the defaultPartitions (as initialPartitions)
    // seems to inflate the contract size by a lot!

    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity,
        address[] memory admins,
        address[] memory controllers
    )
    public
    ERC1400Capped(name, symbol, granularity)
    {
        for (uint i = 0; i < controllers.length; i++) {
            _add(1, controllers[i]);
        }

        for (uint i = 0; i < admins.length; i++) {
            _add(0, admins[i]);
        }
    }


    // add a new Partition proxy contract
    function addPartition(bytes32 partition, address proxyAddress, uint256 partitionCap) public{
        require(hasRole(0, _msgSender()), "A7");

        _setCapByPartition(partition, partitionCap);

        _partitionProxies.push(proxyAddress);

        _setPartitionControllers(partition, _partitionProxies);

        // _totalPartitions is being updated when when minting for the first time
    }


    // bulk minting
    function bulkIssueByPartition(
        bytes32 partition,
        address[] memory tokenHolders,
        uint256[] memory values,
        bytes memory data
    ) public {
        require(_isIssuable, "A8");
        require(tokenHolders.length <= 40, 'too many accounts');
        require(tokenHolders.length == values.length, 'tokenHolders and values must be same length');

        for(uint i = 0; i < tokenHolders.length; i++) {
            require(
                _totalSupplyByPartition[partition].add(values[i]) <= capByPartition(partition),
                'totalSupplyByPartition would exceed capByPartition'
            );
            _issueByPartition(partition, _msgSender(), tokenHolders[i], values[i], data, "");
        }
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

/**
 * Reason codes - ERC1066
 *
 * To improve the token holder experience, canTransfer MUST return a reason byte code
 * on success or failure based on the EIP-1066 application-specific status codes specified below.
 * An implementation can also return arbitrary data as a bytes32 to provide additional
 * information not captured by the reason code.
 *
 * Code	Reason
 * 0xA0	Transfer Verified - Unrestricted
 * 0xA1	Transfer Verified - On-Chain approval for restricted token
 * 0xA2	Transfer Verified - Off-Chain approval for restricted token
 * 0xA3	Transfer Blocked - Sender lockup period not ended
 * 0xA4	Transfer Blocked - Sender balance insufficient
 * 0xA5	Transfer Blocked - Sender not eligible
 * 0xA6	Transfer Blocked - Receiver not eligible
 * 0xA7	Transfer Blocked - Identity restriction
 * 0xA8	Transfer Blocked - Token restriction
 * 0xA9	Transfer Blocked - Token granularity
 */
