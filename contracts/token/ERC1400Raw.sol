pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../erc1820/ERC1820Client.sol";

import "./Constrainable.sol";
import "../interfaces/IERC1400Raw.sol";

/**
 * @title ERC1400Raw
 * @dev ERC1400Raw logic
 */

// INFO got rid of sender recipient check

contract ERC1400Raw is
IERC1400Raw,
Constrainable,
ERC1820Client
{
    using SafeMath for uint256;

    string internal _name;
    string internal _symbol;
    uint256 internal _granularity;
    uint256 internal _totalSupply;

    // Indicate whether the token can still be controlled by operators or not anymore.
    bool internal _isControllable;

    // Mapping from tokenHolder to balance.
    mapping(address => uint256) internal _balances;


    /******************** Mappings related to operator **************************/
    // Mapping from (operator, tokenHolder) to authorized status. [TOKEN-HOLDER-SPECIFIC]
    mapping(address => mapping(address => bool)) internal _authorizedOperator;

    // INFO
    // moved functionality to admin contract controller role
    // Array of controllers. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    // address[] internal _controllers;

    // Mapping from operator to controller status. [GLOBAL - NOT TOKEN-HOLDER-SPECIFIC]
    // mapping(address => bool) internal _isController;
    /****************************************************************************/

    /**
     * @dev Modifier to verify if transfer is validated
     *
     * outsourced this to check function and modular constraints later on
     */
    // modifier isValidCertificate(bytes memory data) {}

    /**
     * [ERC1400Raw CONSTRUCTOR]
     * @dev Initialize ERC1400Raw and CertificateController parameters + register
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
    {
        _name = name;
        _symbol = symbol;
        _totalSupply = 0;
        require(granularity >= 1, 'granularity >= 1');
        // Constructor Blocked - Token granularity can not be lower than 1
        _granularity = granularity;
    }

    /********************** ERC1400Raw EXTERNAL FUNCTIONS ***************************/

    /**
     * [ERC1400Raw INTERFACE (1/13)]
     * @dev Get the name of the token, e.g., "MyToken".
     * @return Name of the token.
     */
    function name() external override view returns (string memory) {
        return _name;
    }

    /**
     * [ERC1400Raw INTERFACE (2/13)]
     * @dev Get the symbol of the token, e.g., "MYT".
     * @return Symbol of the token.
     */
    function symbol() external override view returns (string memory) {
        return _symbol;
    }

    /**
     * [ERC1400Raw INTERFACE (3/13)]
     * @dev Get the total number of issued tokens.
     * @return Total supply of tokens currently in circulation.
     */
    /* function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    } */

    /**
     * [ERC1400Raw INTERFACE (4/13)]
     * @dev Get the balance of the account with address 'tokenHolder'.
     * @param tokenHolder Address for which the balance is returned.
     * @return Amount of token held by 'tokenHolder' in the token contract.
     */
    /* function balanceOf(address tokenHolder) public override view returns (uint256) {
        return _balances[tokenHolder];
    } */

    /**
     * [ERC1400Raw INTERFACE (5/13)]
     * @dev Get the smallest part of the token that’s not divisible.
     * @return The smallest non-divisible part of the token.
     */
    function granularity() external override view returns (uint256) {
        return _granularity;
    }

    /**
     * [ERC1400Raw INTERFACE (6/13)]
     * @dev Get the list of controllers as defined by the Administrable contract.
     * @return List of addresses of all the controllers.
     */
    // TODO implement in Administrable?
    /*
    function controllers() external view returns (address[] memory) {
        address[] memory activeControllers = _controllers;

        // only return active entries (we only add to _controllers in Administrable)
        for(uint i = 0; i < _controllers.length; i++) {
            if(hasRole(bytes32("CONTROLLER"), _controllers[i])) {
                delete activeControllers[i];
            }
        }
        return activeControllers;
    }*/

    /**
     * [ERC1400Raw INTERFACE (7/13)]
     * @dev Set a third party operator address as an operator of 'msg.sender' to transfer
     * and redeem tokens on its behalf.
     * @param operator Address to set as an operator for 'msg.sender'.
     */
    // we only use authorizeOperatorByPartition()
    function authorizeOperator(address operator) external override {
        require(operator != _msgSender(), "");
        _authorizedOperator[operator][_msgSender()] = true;
        emit AuthorizedOperator(operator, _msgSender());
    }

    /**
     * [ERC1400Raw INTERFACE (8/13)]
     * @dev Remove the right of the operator address to be an operator for 'msg.sender'
     * and to transfer and redeem tokens on its behalf.
     * @param operator Address to rescind as an operator for 'msg.sender'.
     */
    // we only use revokeOperatorByPartition()
    function revokeOperator(address operator) external override {
        require(operator != _msgSender(), "");
        _authorizedOperator[operator][_msgSender()] = false;
        emit RevokedOperator(operator, _msgSender());
    }

    /**
     * [ERC1400Raw INTERFACE (9/13)]
     * @dev Indicate whether the operator address is an operator of the tokenHolder address.
     * @param operator Address which may be an operator of tokenHolder.
     * @param tokenHolder Address of a token holder which may have the operator address as an operator.
     * @return 'true' if operator is an operator of 'tokenHolder' and 'false' otherwise.
     */
    // we only use isOperatorForPartition()
    function isOperator(address operator, address tokenHolder) external view override returns (bool) {
        return _isOperator(operator, tokenHolder);
    }

    /**
     * [ERC1400Raw INTERFACE (10/13)]
     * @dev Transfer the amount of tokens from the address 'msg.sender' to the address 'to'.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer, by the token holder.
     */
    // is overridden in ERC1400Partition
    /* function transferWithData(address to, uint256 value, bytes calldata data)
    external override
    {
        _transferWithData("", _msgSender(), _msgSender(), to, value, data, "");
    } */

    /**
     * [ERC1400Raw INTERFACE (11/13)]
     * @dev Transfer the amount of tokens on behalf of the address 'from' to the address 'to'.
     * @param from Token holder (or 'address(0)' to set from to 'msg.sender').
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer, and intended for the token holder ('from').
     * @param operatorData Information attached to the transfer by the operator.
     */
    // is overridden in ERC1400Partition
    /* function transferFromWithData(
        address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData)
    external override
    {
        require(_isOperator(_msgSender(), from), "A7");
        // Transfer Blocked - Identity restriction

        _transferWithData("", _msgSender(), from, to, value, data, operatorData);
    } */

    /**
     * [ERC1400Raw INTERFACE (12/13)]
     * @dev Redeem the amount of tokens from the address 'msg.sender'.
     * @param value Number of tokens to redeem.
     * @param data Information attached to the redemption, by the token holder.
     */
    // is deleted in ERC1400Partition
    /*
    function redeem(uint256 value, bytes calldata data)
    external
    {
        _redeem("", _msgSender(), _msgSender(), value, data, "");
    }

    /**
     * [ERC1400Raw INTERFACE (13/13)]
     * @dev Redeem the amount of tokens on behalf of the address from.
     * @param from Token holder whose tokens will be redeemed (or address(0) to set from to msg.sender).
     * @param value Number of tokens to redeem.
     * @param data Information attached to the redemption.
     * @param operatorData Information attached to the redemption, by the operator.
     */
    // is deleted in ERC1400Partition
    /*
    function redeemFrom(address from, uint256 value, bytes calldata data, bytes calldata operatorData)
    external
    {
        require(_isOperator(_msgSender(), from), "A7");
        // Transfer Blocked - Identity restriction

        _redeem("", _msgSender(), from, value, data, operatorData);
    }

    /********************** ERC1400Raw INTERNAL FUNCTIONS ***************************/

    /**
     * [INTERNAL]
     * @dev Check if 'value' is multiple of the granularity.
     * @param value The quantity that want's to be checked.
     * @return 'true' if 'value' is a multiple of the granularity.
     */
    function _isMultiple(uint256 value) internal view returns (bool) {
        return (value.div(_granularity).mul(_granularity) == value);
    }

    /**
     * [INTERNAL]
     * @dev Check whether an address is a regular address or not.
     * @param addr Address of the contract that has to be checked.
     * @return 'true' if 'addr' is a regular address (not a contract).
     */
    /*function _isRegularAddress(address addr) internal view returns (bool) {
        if (addr == address(0)) {return false;}
        uint size;
        assembly {size := extcodesize(addr)}
        // solhint-disable-line no-inline-assembly
        return size == 0;
    }*/

    /**
     * [INTERNAL]
     * @dev Indicate whether the operator address is an operator of the tokenHolder address.
     * @param operator Address which may be an operator of 'tokenHolder'.
     * @param tokenHolder Address of a token holder which may have the 'operator' address as an operator.
     * @return 'true' if 'operator' is an operator of 'tokenHolder' and 'false' otherwise.
     */
    function _isOperator(address operator, address tokenHolder) internal view returns (bool) {
        return (operator == tokenHolder ||
            _authorizedOperator[operator][tokenHolder] ||
            (_isControllable && hasRole(bytes32("CONTROLLER"), operator))
        );
    }

    /**
     * [INTERNAL]
     * @dev Perform the transfer of tokens.
     * @param partition Name of the partition (bytes32 to be left empty for ERC1400Raw transfer).
     * @param operator The address performing the transfer.
     * @param from Token holder.
     * @param to Token recipient.
     * @param value Number of tokens to transfer.
     * @param data Information attached to the transfer.
     * @param operatorData Information attached to the transfer by the operator (if any)..
     */

    function _transferWithData(
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    nonReentrant
    {
        require(_isMultiple(value), "A9");
        // Transfer Blocked - Token granularity
        require(to != address(0), "A6");
        // Transfer Blocked - Receiver not eligible
        require(_balances[from] >= value, "A4");
        // Transfer Blocked - Sender balance insufficient

        // CONTROLLER bypasses constraint modules
        if(!(_isControllable && hasRole(bytes32("CONTROLLER"), _msgSender()))) {
            _executeTransfer(_msgSender(), partition, operator, from, to, value, data, operatorData);
        }

        // _callSender(partition, operator, from, to, value, data, operatorData);

        _balances[from] = _balances[from].sub(value);
        _balances[to] = _balances[to].add(value);

        // _callRecipient(partition, operator, from, to, value, data, operatorData, preventLocking);

        emit TransferWithData(operator, from, to, value, data, operatorData);
    }

    /**
     * [INTERNAL]
     * @dev Perform the token redemption.
     * @param operator The address performing the redemption.
     * @param from Token holder whose tokens will be redeemed.
     * @param value Number of tokens to redeem.
     * @param data Information attached to the redemption.
     * @param operatorData Information attached to the redemption, by the operator (if any).
     */
    function _redeem(address operator, address from, uint256 value, bytes memory data, bytes memory operatorData)
    internal
    nonReentrant
    {
        require(_isMultiple(value), "A9");
        // Transfer Blocked - Token granularity
        require(from != address(0), "A5");
        // Transfer Blocked - Sender not eligible
        require(_balances[from] >= value, "A4");
        // Transfer Blocked - Sender balance insufficient

        // is REDEEMER
        require(hasRole(bytes32("REDEEMER"), _msgSender()), "A7");

        // we don't validate when redeeming

        _balances[from] = _balances[from].sub(value);
        _totalSupply = _totalSupply.sub(value);

        emit Redeemed(operator, from, value, data, operatorData);
    }

    /**
     * [INTERNAL]
     * @dev Check for 'ERC1400TokensSender' hook on the sender and call it.
     * May throw according to 'preventLocking'.
     * @param partition Name of the partition (bytes32 to be left empty for ERC1400Raw transfer).
     * @param operator Address which triggered the balance decrease (through transfer or redemption).
     * @param from Token holder.
     * @param to Token recipient for a transfer and 0x for a redemption.
     * @param value Number of tokens the token holder balance is decreased by.
     * @param data Extra information.
     * @param operatorData Extra information, attached by the operator (if any).
     */
    /*function _callSender(
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    {
        address senderImplementation;
        senderImplementation = interfaceAddr(from, "ERC1400TokensSender");

        if (senderImplementation != address(0)) {
            IERC1400TokensSender(senderImplementation).tokensToTransfer(partition, operator, from, to, value, data, operatorData);
        }
    }*/

    /**
     * [INTERNAL]
     * @dev Check for 'ERC1400TokensRecipient' hook on the recipient and call it.
     * May throw according to 'preventLocking'.
     * @param partition Name of the partition (bytes32 to be left empty for ERC1400Raw transfer).
     * @param operator Address which triggered the balance increase (through transfer or issuance).
     * @param from Token holder for a transfer and 0x for an issuance.
     * @param to Token recipient.
     * @param value Number of tokens the recipient balance is increased by.
     * @param data Extra information, intended for the token holder ('from').
     * @param operatorData Extra information attached by the operator (if any).
     * @param preventLocking 'true' if you want this function to throw when tokens are sent to a contract not
     * implementing 'ERC1400TokensRecipient'.
     * ERC1400Raw native transfer functions MUST set this parameter to 'true', and backwards compatible ERC20 transfer
     * functions SHOULD set this parameter to 'false'.
     */
    /*function _callRecipient(
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData,
        bool preventLocking
    )
    internal
    {
        address recipientImplementation;
        recipientImplementation = interfaceAddr(to, "ERC1400TokensRecipient");

        if (recipientImplementation != address(0)) {
            IERC1400TokensRecipient(recipientImplementation).tokensReceived(partition, operator, from, to, value, data, operatorData);
        } else if (preventLocking) {
            require(_isRegularAddress(to), "A6");
            // Transfer Blocked - Receiver not eligible
        }
    }*/

    /**
     * [INTERNAL]
     * @dev Perform the issuance of tokens.
     * @param operator Address which triggered the issuance.
     * @param to Token recipient.
     * @param value Number of tokens issued.
     * @param data Information attached to the issuance, and intended for the recipient (to).
     * @param operatorData Information attached to the issuance by the operator (if any).
     */
    function _issue(
        address operator,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    nonReentrant
    {
        require(_isMultiple(value), "A9");
        // Transfer Blocked - Token granularity
        require(to != address(0), "A6");
        // Transfer Blocked - Receiver not eligible

        require(hasRole(bytes32("ISSUER"), _msgSender()), "A7");

        // we don't validate when minting

        _totalSupply = _totalSupply.add(value);
        _balances[to] = _balances[to].add(value);

        // _callRecipient(partition, operator, address(0), to, value, data, operatorData, true);

        emit Issued(operator, to, value, data, operatorData);
    }

    /********************** ERC1400Raw OPTIONAL FUNCTIONS ***************************/

    /**
     * [NOT MANDATORY FOR ERC1400Raw STANDARD]
     * @dev Set list of token controllers.
     * @param operators Controller addresses.
     */

    // instead of setting the controllers here, we set admin roles in Administrable constructor
    // function _setControllers(address[] memory operators) internal {}

}
