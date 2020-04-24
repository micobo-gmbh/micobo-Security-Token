pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/GSNRecipient.sol";

contract GSNable is GSNRecipient {
    // GSN

    bool allowGSN = true;

    function acceptRelayedCall(
        address /*relay*/,
        address /*from*/,
        bytes calldata /* encodedFunction */,
        uint256 /*transactionFee*/,
        uint256 /*gasPrice*/,
        uint256 /*gasLimit*/,
        uint256 /*nonce*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxPossibleCharge*/
    ) external override view returns (uint256, bytes memory) {

        require(allowGSN, "gsn not allowed");

        return _approveRelayedCall();
    }

    function _preRelayedCall(bytes memory /*context*/) internal override returns (bytes32) {
        return "";
    }

    function _postRelayedCall(
        bytes memory /*context*/,
        bool /*success*/,
        uint256 /*actualCharge*/,
        bytes32 /*preRetVal*/
    ) internal override{

    }

    function setAllowGSN(bool allow) public {
        allowGSN = allow;
    }
}