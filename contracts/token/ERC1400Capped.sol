/*
 * This code has not been reviewed.
 * Do not use or deploy this code before reviewing it personally first.
 */
pragma solidity 0.5.12;

import "../interfaces/IERC1400Capped.sol";
import "./ERC1400Partition.sol";

/**
 * @title ERC1400
 * @dev ERC1400 logic
 */
contract ERC1400Capped is IERC1400Capped, ERC1400Partition {

    struct Doc {
        string docURI;
        bytes32 docHash;
    }

    // Mapping for token URIs.
    mapping(bytes32 => Doc) internal _documents;

    // Indicate whether the token can still be issued by the issuer or not anymore.
    bool internal _isIssuable;

    /**
     * @dev Modifier to verify if token is issuable.
     */


    //**************CAPPED*******************

    uint256 private _cap;

    mapping(bytes32 => uint256) private _capByPartition;


    //**************CAPPED*******************


    /**
     * [ERC1400 CONSTRUCTOR]
     * @dev Initialize ERC1400 + register
     * the contract implementation in ERC1820Registry.
     * @param name Name of the token.
     * @param symbol Symbol of the token.
     * @param granularity Granularity of the token.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity
    )
    public
    ERC1400Partition(name, symbol, granularity)
    {
        // TODO activate when live
        // setInterfaceImplementation("ERC1400Token", address(this));
        _isIssuable = true;
    }


    /********************** ERC1400 EXTERNAL FUNCTIONS **************************/

    /**
     * [ERC1400 INTERFACE (1/9)]
     * @dev Access a document associated with the token.
     * @param documentName Short name (represented as a bytes32) associated to the document.
     * @return Requested document + document hash.
     */
    function getDocument(bytes32 documentName) external view returns (string memory, bytes32) {
        require(bytes(_documents[documentName].docURI).length != 0, "Empty document");
        // Action Blocked - Empty document
        return (
        _documents[documentName].docURI,
        _documents[documentName].docHash
        );
    }

    /**
     * [ERC1400 INTERFACE (2/9)]
     * @dev Associate a document with the token.
     * @param documentName Short name (represented as a bytes32) associated to the document.
     * @param uri Document content.
     * @param documentHash Hash of the document [optional parameter].
     */
    function setDocument(bytes32 documentName, string calldata uri, bytes32 documentHash) external {
        require(hasRole(7, _msgSender()), "0x07");
        _documents[documentName] = Doc({
            docURI : uri,
            docHash : documentHash
            });
        emit Document(documentName, uri, documentHash);
    }

    /**
     * [ERC1400 INTERFACE (3/9)]
     * @dev Know if the token can be controlled by operators.
     * If a token returns 'false' for 'isControllable()'' then it MUST always return 'false' in the future.
     * @return bool 'true' if the token can still be controlled by operators, 'false' if it can't anymore.
     */
    function isControllable() external view returns (bool) {
        return _isControllable;
    }

    /**
     * [ERC1400 INTERFACE (4/9)]
     * @dev Know if new tokens can be issued in the future.
     * @return bool 'true' if tokens can still be issued by the issuer, 'false' if they can't anymore.
     */
    function isIssuable() external view returns (bool) {
        return _isIssuable;
    }

    /**
     * [ERC1400 INTERFACE (5/9)]
     * @dev Issue tokens from a specific partition.
     * @param partition Name of the partition.
     * @param tokenHolder Address for which we want to issue tokens.
     * @param value Number of tokens issued.
     * @param data Information attached to the issuance, by the issuer. [CONTAINS THE CONDITIONAL OWNERSHIP CERTIFICATE]
     */
    function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data)
    external
        // onlyMinter is taken care of in _issue function
    {
        require(_isIssuable, "A8");

        // total cap is always the sum of all partitionCaps, so it can't be violated

        require(
            _totalSupplyByPartition[partition].add(value) <= _capByPartition[partition],
            'totalSupplyByPartition would exceed capByPartition'
        );

        _issueByPartition(partition, _msgSender(), tokenHolder, value, data, "");
    }

    /**
     * [ERC1400 INTERFACE (6/9)]
     * @dev Redeem tokens of a specific partition.
     * @param partition Name of the partition.
     * @param value Number of tokens redeemed.
     * @param data Information attached to the redemption, by the redeemer. [CONTAINS THE CONDITIONAL OWNERSHIP CERTIFICATE]
     */
    // only controllers can redeem
    /*function redeemByPartition(bytes32 partition, uint256 value, bytes calldata data)
    external
    {
        _redeemByPartition(partition, _msgSender(), _msgSender(), value, data, "");
    }*/

    /**
     * [ERC1400 INTERFACE (7/9)]
     * @dev Redeem tokens of a specific partition.
     * @param partition Name of the partition.
     * @param tokenHolder Address for which we want to redeem tokens.
     * @param value Number of tokens redeemed.
     * @param data Information attached to the redemption.
     * @param operatorData Information attached to the redemption, by the operator. [CONTAINS THE CONDITIONAL OWNERSHIP CERTIFICATE]
     */

    function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data, bytes calldata operatorData)
    external
    {
        // only BURNER can burn tokens (checked in _redeem())

        // require(_isOperatorForPartition(partition, _msgSender(), tokenHolder), "A7");
        // Transfer Blocked - Identity restriction

        _redeemByPartition(partition, _msgSender(), tokenHolder, value, data, operatorData);
    }

    // TODO were these only used for standardized use of the off-chain validator?
    // we could test-run transfers locally if we want to find out if they succeed

    /**
     * [ERC1400 INTERFACE (8/9)]
     * @dev Know the reason on success or failure based on the EIP-1066 application-specific status codes.
     * @param partition Name of the partition.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer, by the token holder. [CONTAINS THE CONDITIONAL OWNERSHIP CERTIFICATE]
     * @return ESC (Ethereum Status Code) following the EIP-1066 standard.
     * @return Additional bytes32 parameter that can be used to define
     * application specific reason codes with additional details (for example the
     * transfer restriction rule responsible for making the transfer operation invalid).
     * @return Destination partition.
     */

    /*function canTransferByPartition(bytes32 partition, address to, uint256 value, bytes calldata data)
    external
    view
    returns (byte, bytes32, bytes32)
    {
        return _canTransfer(partition, _msgSender(), _msgSender(), to, value, data, "");
    }

   *//**
     * [ERC1400 INTERFACE (9/9)]
     * @dev Know the reason on success or failure based on the EIP-1066 application-specific status codes.
     * @param partition Name of the partition.
     * @param from Token holder.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer. [CAN CONTAIN THE DESTINATION PARTITION]
     * @param operatorData Information attached to the transfer, by the operator. [CONTAINS THE CONDITIONAL OWNERSHIP CERTIFICATE]
     * @return ESC (Ethereum Status Code) following the EIP-1066 standard.
     * @return Additional bytes32 parameter that can be used to define
     * application specific reason codes with additional details (for example the
     * transfer restriction rule responsible for making the transfer operation invalid).
     * @return Destination partition.
     *//*

    function canOperatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData)
    external
    view
    returns (byte, bytes32, bytes32)
    {
        return _canTransfer(partition, _msgSender(), from, to, value, data, operatorData);
    }*/

    /********************** ERC1400 INTERNAL FUNCTIONS **************************/

    /**
     * [INTERNAL]
     * @dev Know the reason on success or failure based on the EIP-1066 application-specific status codes.
     * @param partition Name of the partition.
     * @param operator The address performing the transfer.
     * @param from Token holder.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer. [CAN CONTAIN THE DESTINATION PARTITION]
     * @param operatorData Information attached to the transfer, by the operator (if any).
     * @return ESC (Ethereum Status Code) following the EIP-1066 standard.
     * @return Additional bytes32 parameter that can be used to define
     * application specific reason codes with additional details (for example the
     * transfer restriction rule responsible for making the transfer operation invalid).
     * @return Destination partition.
     */

    /*function _canTransfer(
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
    returns (byte, bytes32, bytes32)
    {
        if (!_isOperatorForPartition(partition, operator, from))
            return (hex"A7", "", partition);
        // "Transfer Blocked - Identity restriction"

        if ((_balances[from] < value) || (_balanceOfByPartition[from][partition] < value))
            return (hex"A4", "", partition);
        // Transfer Blocked - Sender balance insufficient

        if (to == address(0))
            return (hex"A6", "", partition);
        // Transfer Blocked - Receiver not eligible

        validateTransaction(_msgSender(), partition, operator, from, to, value, data, operatorData);


        address senderImplementation;
        address recipientImplementation;
        senderImplementation = interfaceAddr(from, "ERC1400TokensSender");
        recipientImplementation = interfaceAddr(to, "ERC1400TokensRecipient");

        *//*if ((senderImplementation != address(0))
            && !IERC1400TokensSender(senderImplementation).canTransfer(partition, from, to, value, data, operatorData))
            return (hex"A5", "", partition);
        // Transfer Blocked - Sender not eligible

        if ((recipientImplementation != address(0))
            && !IERC1400TokensRecipient(recipientImplementation).canReceive(partition, from, to, value, data, operatorData))
            return (hex"A6", "", partition);
        // Transfer Blocked - Receiver not eligible*//*

        if (!_isMultiple(value))
            return (hex"A9", "", partition);
        // Transfer Blocked - Token granularity

        return (hex"A2", "", partition);
        // Transfer Verified - Off-Chain approval for restricted token
    }
*/
    /**
     * [INTERNAL]
     * @dev Issue tokens from a specific partition.
     * @param toPartition Name of the partition.
     * @param operator The address performing the issuance.
     * @param to Token recipient.
     * @param value Number of tokens to issue.
     * @param data Information attached to the issuance.
     * @param operatorData Information attached to the issuance, by the operator (if any).
     */

    function _issueByPartition(
        bytes32 toPartition,
        address operator,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    {
        _issue(toPartition, operator, to, value, data, operatorData);
        _addTokenToPartition(to, toPartition, value);

        emit IssuedByPartition(toPartition, operator, to, value, data, operatorData);
    }

    /**
     * [INTERNAL]
     * @dev Redeem tokens of a specific partition.
     * @param fromPartition Name of the partition.
     * @param operator The address performing the redemption.
     * @param from Token holder whose tokens will be redeemed.
     * @param value Number of tokens to redeem.
     * @param data Information attached to the redemption.
     * @param operatorData Information attached to the redemption, by the operator (if any).
     */

    function _redeemByPartition(
        bytes32 fromPartition,
        address operator,
        address from,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    {
        require(_balanceOfByPartition[from][fromPartition] >= value, "A4");
        // Transfer Blocked - Sender balance insufficient

        _removeTokenFromPartition(from, fromPartition, value);
        _redeem(fromPartition, operator, from, value, data, operatorData);

        emit RedeemedByPartition(fromPartition, operator, from, value, data, operatorData);
    }

    /********************** ERC1400 OPTIONAL FUNCTIONS **************************/

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Definitely renounce the possibility to control tokens on behalf of tokenHolders.
     * Once set to false, '_isControllable' can never be set to 'true' again.
     */
    function renounceControl()
    external
    {
        require(hasRole(0, _msgSender()));
        _isControllable = false;
    }

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Definitely renounce the possibility to issue new tokens.
     * Once set to false, '_isIssuable' can never be set to 'true' again.
     */
    function renounceIssuance()
    external
    {
        require(hasRole(0, _msgSender()));
        _isIssuable = false;
    }

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Set list of token controllers.
     * @param operators Controller addresses.
     */
    // REPLACED with Administrable
    /*
    function setControllers(address[] calldata operators)
    external
    onlyRole(0)
    {
        _setControllers(operators);
    }
    */

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Set list of token partition controllers.
     * @param partition Name of the partition.
     * @param operators Controller addresses.
     */

    function setPartitionControllers(bytes32 partition, address[] calldata operators)
    external
    {
        require(hasRole(0, _msgSender()));
        _setPartitionControllers(partition, operators);
    }

    // INFO no setCertificateSigner function here!




    //**************CAPPED*******************

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view returns (uint256) {
        return _cap;
    }

    function capByPartition(bytes32 partition) public view returns (uint256) {
        return _capByPartition[partition];
    }

    function setCapByPartition(bytes32 partition, uint256 newPartitionCap) public {
        require(hasRole(5, _msgSender()), '0x07, not allowed to set cap');
        require((newPartitionCap > _capByPartition[partition]), 'cap must be greater than old one');

        // add difference to total cap
        _cap = _cap.add((newPartitionCap.sub(_capByPartition[partition])));

        // set new cap
        _capByPartition[partition] = newPartitionCap;
    }

    //**************CAPPED*******************

}
