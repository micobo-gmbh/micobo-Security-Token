pragma solidity 0.6.6;

import "./ERC1400ERC20.sol";

import "../interfaces/IERC1400.sol";
import "../interfaces/IERC1400Capped.sol";




/**
 * @author openzeppelin
 * @title Capped token
 * @dev token with a total cap and partition specific caps.
 * Cap cannot be changed afterwards.
 */
contract SecurityToken is ERC1400ERC20, IERC1400, IERC1400Capped {

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
        uint256 granularity,
        uint256 cap,
        address admin,
        address controller,
        address issuer,
        address redeemer,
        address module_editor
    )
    public
    ERC1400ERC20(name, symbol, granularity)
    {
        _add(bytes32("ADMIN"), admin);
        _add(bytes32("CONTROLLER"), controller);
        _add(bytes32("ISSUER"), issuer);
        _add(bytes32("REDEEMER"), redeemer);
        _add(bytes32("MODULE_EDITOR"), module_editor);

        _cap = cap;

        setInterfaceImplementation("ERC1400Token", address(this));

        _isIssuable = true;
        _isControllable = true;

    }


    // add a new Partition proxy contract
    function addPartitionProxy(bytes32 partition, address proxyAddress) public{
        require(hasRole(bytes32("ADMIN"), _msgSender()), "A7");

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
        require(tokenHolders.length == values.length, 'tokenHolders and values must be same length');

        for(uint i = 0; i < tokenHolders.length; i++) {
            require(
                _totalSupply.add(values[i]) <= _cap,
                'totalSupply would exceed cap'
            );
            _issueByPartition(partition, _msgSender(), tokenHolders[i], values[i], data, "");
        }
    }

    // GSN
    function _isGSNController() internal view override returns (bool) {
        return hasRole(bytes32("GSN_CONTROLLER"), _msgSender());
    }




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


    //**************CAPPED*******************

    uint256 private _cap;

    //**************CAPPED*******************



    /********************** ERC1400 EXTERNAL FUNCTIONS **************************/

    /**
     * [ERC1400 INTERFACE (1/9)]
     * @dev Access a document associated with the token.
     * @param documentName Short name (represented as a bytes32) associated to the document.
     * @return Requested document + document hash.
     */
    function getDocument(bytes32 documentName) external override view returns (string memory, bytes32) {
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
    function setDocument(bytes32 documentName, string calldata uri, bytes32 documentHash) external override {
        require(hasRole(bytes32("DOCUMENT_EDITOR"), _msgSender()), "A7");
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
    function isControllable() external override view returns (bool) {
        return _isControllable;
    }

    /**
     * [ERC1400 INTERFACE (4/9)]
     * @dev Know if new tokens can be issued in the future.
     * @return bool 'true' if tokens can still be issued by the issuer, 'false' if they can't anymore.
     */
    function isIssuable() external override view returns (bool) {
        return _isIssuable;
    }

    /**
     * [ERC1400 INTERFACE (5/9)]
     * @dev Issue tokens from a specific partition.
     * @param partition Name of the partition.
     * @param tokenHolder Address for which we want to issue tokens.
     * @param value Number of tokens issued.
     * @param data Information attached to the issuance, by the issuer.
     */
    function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data)
    external override
        // onlyMinter is taken care of in _issue function
    {
        require(_isIssuable, "A8");

        // total cap is always the sum of all partitionCaps, so it can't be violated

        require(
            _totalSupply.add(value) <= _cap,
            'totalSupply would exceed cap'
        );

        _issueByPartition(partition, _msgSender(), tokenHolder, value, data, "");
    }

    /**
     * [ERC1400 INTERFACE (6/9)]
     * @dev Redeem tokens of a specific partition.
     * @param partition Name of the partition.
     * @param value Number of tokens redeemed.
     * @param data Information attached to the redemption, by the redeemer.
     */
    // only controllers can redeem
    function redeemByPartition(bytes32 partition, uint256 value, bytes calldata data)
    external override
    {
        // only REDEEMER can burn tokens (checked in _redeem())

        _redeemByPartition(partition, _msgSender(), _msgSender(), value, data, "");
    }

    /**
     * [ERC1400 INTERFACE (7/9)]
     * @dev Redeem tokens of a specific partition.
     * @param partition Name of the partition.
     * @param tokenHolder Address for which we want to redeem tokens.
     * @param value Number of tokens redeemed.
     * @param data Information attached to the redemption.
     * @param operatorData Information attached to the redemption, by the operator.
     */

    function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes calldata data, bytes calldata operatorData)
    external override
    {
        // only REDEEMER can burn tokens (checked in _redeem())

        require(_isOperatorForPartition(partition, _msgSender(), tokenHolder),  "A7");
        // Transfer Blocked - Identity restriction

        _redeemByPartition(partition, _msgSender(), tokenHolder, value, data, operatorData);
    }

    // only used for standardized use of the off-chain validator?
    // we could test-run transfers locally if we want to find out if they succeed
    /**
     * [ERC1400 INTERFACE (8/9)]
     * @dev Know the reason on success or failure based on the EIP-1066 application-specific status codes.
     * @param partition Name of the partition.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer, by the token holder.
     * @return ESC (Ethereum Status Code) following the EIP-1066 standard.
     * @return Additional bytes32 parameter that can be used to define
     * application specific reason codes with additional details (for example the
     * transfer restriction rule responsible for making the transfer operation invalid).
     * @return Destination partition.
     */

    function canTransferByPartition(bytes32 partition, address to, uint256 value, bytes calldata data)
    external
    view
    override
    returns (byte, bytes32, bytes32)
    {
        return _canTransfer(partition, _msgSender(), _msgSender(), to, value, data, "");
    }


    /**
     * [ERC1400 INTERFACE (9/9)]
     * @dev Know the reason on success or failure based on the EIP-1066 application-specific status codes.
     * @param partition Name of the partition.
     * @param from Token holder.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer. [CAN CONTAIN THE DESTINATION PARTITION]
     * @param operatorData Information attached to the transfer, by the operator.
     * @return ESC (Ethereum Status Code) following the EIP-1066 standard.
     * @return Additional bytes32 parameter that can be used to define
     * application specific reason codes with additional details (for example the
     * transfer restriction rule responsible for making the transfer operation invalid).
     * @return Destination partition.
     */

    function canOperatorTransferByPartition(
        bytes32 partition,
        address from,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata operatorData
    )
    external
    view
    override
    returns (byte, bytes32, bytes32)
    {
        // controller bypasses constraints
        if(_isControllable && hasRole(bytes32("CONTROLLER"), _msgSender())) {
            return (hex"A2", "", partition);
        }
        if (!_isOperatorForPartition(partition, _msgSender(), from))
            return (hex"A7", "", partition);
        // "Transfer Blocked - Identity restriction"

        return _canTransfer(partition, _msgSender(), from, to, value, data, operatorData);
    }

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

    function _canTransfer(
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
        if ((_balances[from] < value) || (_balanceOfByPartition[from][partition] < value))
            return (hex"A4", "", partition);
        // Transfer Blocked - Sender balance insufficient

        if (to == address(0))
            return (hex"A6", "", partition);
        // Transfer Blocked - Receiver not eligible

        // NO ERC777

        /* address senderImplementation;
        address recipientImplementation;
        senderImplementation = interfaceAddr(from, "ERC1400TokensSender");
        recipientImplementation = interfaceAddr(to, "ERC1400TokensRecipient"); */

        /* if ((senderImplementation != address(0))
            && !IERC1400TokensSender(senderImplementation).canTransfer(partition, from, to, value, data, operatorData))
            return (hex"A5", "", partition); */
        // Transfer Blocked - Sender not eligible

        /* if ((recipientImplementation != address(0))
            && !IERC1400TokensRecipient(recipientImplementation).canReceive(partition, from, to, value, data, operatorData))
            return (hex"A6", "", partition); */
        // Transfer Blocked - Receiver not eligible

        if (!_isMultiple(value))
            return (hex"A9", "", partition);
        // Transfer Blocked - Token granularity


        (bool valid, byte code, bytes32 extradata, ) = _validateTransfer(
            _msgSender(),
            partition,
            operator,
            from,
            to,
            value,
            data,
            operatorData
        );

        if (!valid) {
            return (code, extradata, partition);
        }

        return (hex"A2", "", partition);
        // Transfer Verified - Off-Chain approval for restricted token
    }


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
        _issue(operator, to, value, data, operatorData);
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
        _redeem(operator, from, value, data, operatorData);

        emit RedeemedByPartition(fromPartition, operator, from, value, data, operatorData);
    }

    /********************** ERC1400 OPTIONAL FUNCTIONS **************************/

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Definitely renounce the possibility to control tokens on behalf of tokenHolders.
     * Once set to false, '_isControllable' can never be set to 'true' again.
     */
     // INFO this disables ERC20 proxyx contracts
    function renounceControl()
    external override
    {
        require(hasRole(bytes32("ADMIN"), _msgSender()), "A7");
        _isControllable = false;
    }

    /**
     * [NOT MANDATORY FOR ERC1400 STANDARD]
     * @dev Definitely renounce the possibility to issue new tokens.
     * Once set to false, '_isIssuable' can never be set to 'true' again.
     */
    function renounceIssuance()
    external override
    {
        require(hasRole(bytes32("ADMIN"), _msgSender()), "A7");
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

    // We don't allow this function publicly. Only proxies use it
    // and have to continue to use it even after _isControllable is false
    // this is why partitionControllers are only set in addPartition()
    function setPartitionControllers(bytes32 partition, address[] calldata operators)
    external override
    {
        require(hasRole(bytes32("ADMIN"), _msgSender()), "A7");
        _setPartitionControllers(partition, operators);
    }

    // INFO no setCertificateSigner function, offline valdation works through modules




    //**************CAPPED*******************

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public override view returns (uint256) {
        return _cap;
    }

    function setCap(uint256 newCap) public override {
        require(hasRole(bytes32("CAP_EDITOR"), _msgSender()), 'A7, not allowed to set cap');
        require((newCap > _cap), 'cap must be greater than old one');

        // set new cap
        _cap = newCap;
    }

    //**************CAPPED*******************

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
