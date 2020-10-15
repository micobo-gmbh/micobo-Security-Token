pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../erc1820/ERC1820Client.sol";

import "./Constrainable.sol";
import "../interfaces/IERC1400Raw.sol";


/**
 * @title ERC1400Raw
 * @dev ERC1400Raw logic
 */
contract ERC1400Raw is IERC1400Raw, Constrainable, ERC1820Client {
	using SafeMath for uint256;

	string internal _name;
	string internal _symbol;
	uint256 internal _granularity;
	uint256 internal _totalSupply;

	// Indicate whether the token can still be controlled by operators or not anymore.
	bool internal _isControllable;

	/**
	 * @dev Indicates the paused state
	 */
	bool internal _paused;

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
	 * outsourced this to execute function and modular constraints later on
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
	) public {
		_name = name;
		_symbol = symbol;
		_totalSupply = 0;
		require(granularity >= 1, "granularity too low");
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
	 * @dev Always returns an empty array, since controllers are only managed in Administrable
	 * @return c Empty list
	 */
	function controllers() external override view returns (address[] memory c) {
		return c;
	}

	/**
	 * [ERC1400Raw INTERFACE (7/13)]
	 * @dev Set a third party operator address as an operator of 'msg.sender' to transfer
	 * and redeem tokens on its behalf.
	 * @param operator Address to set as an operator for 'msg.sender'.
	 */
	function authorizeOperator(address operator) external override {
		require(operator != _msgSender(), "cannot authorize yourself");
		_authorizedOperator[operator][_msgSender()] = true;
		emit AuthorizedOperator(operator, _msgSender());
	}

	/**
	 * [ERC1400Raw INTERFACE (8/13)]
	 * @dev Remove the right of the operator address to be an operator for 'msg.sender'
	 * and to transfer and redeem tokens on its behalf.
	 * @param operator Address to rescind as an operator for 'msg.sender'.
	 */
	function revokeOperator(address operator) external override {
		require(operator != _msgSender(), "cannot revoke yourself");
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
	function isOperator(address operator, address tokenHolder)
		external
		override
		view
		returns (bool)
	{
		return _isOperator(operator, tokenHolder);
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
	 * @dev Indicate whether the operator address is an operator of the tokenHolder address.
	 * @param operator Address which may be an operator of 'tokenHolder'.
	 * @param tokenHolder Address of a token holder which may have the 'operator' address as an operator.
	 * @return 'true' if 'operator' is an operator of 'tokenHolder' and 'false' otherwise.
	 */
	function _isOperator(address operator, address tokenHolder)
		internal
		view
		returns (bool)
	{
		return (operator == tokenHolder ||
			_authorizedOperator[operator][tokenHolder] ||
			(_isControllable && hasRole(bytes32("CONTROLLER"), operator)));
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
	) internal nonReentrant {
		require(_isMultiple(value), "violates granularity");
		// Transfer Blocked - Token granularity
		require(to != address(0), "zero address");
		// Transfer Blocked - Receiver not eligible
		// require(_balances[from] >= value, "insufficient balance"); // already checked in ERC1400Partition
		// Transfer Blocked - Sender balance insufficient

		require(!_paused, "paused");

		// CONTROLLER bypasses constraint modules
		if (
			!(_isControllable && hasRole(bytes32("CONTROLLER"), _msgSender()))
		) {
			_executeTransfer(
				_msgSender(),
				partition,
				operator,
				from,
				to,
				value,
				data,
				operatorData
			);
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
	function _redeem(
		address operator,
		address from,
		uint256 value,
		bytes memory data,
		bytes memory operatorData
	) internal nonReentrant {
		require(_isMultiple(value), "violates granularity");
		// Transfer Blocked - Token granularity
		require(from != address(0), "zero address");
		// Transfer Blocked - Sender not eligible
		// require(_balances[from] >= value, "insufficient balance");
		// already checked in _redeemByPartition

		// is REDEEMER
		require(hasRole(bytes32("REDEEMER"), _msgSender()), "!REDEEMER");

		// we don't validate when redeeming

		_balances[from] = _balances[from].sub(value);
		_totalSupply = _totalSupply.sub(value);

		emit Redeemed(operator, from, value, data, operatorData);
	}

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
	) internal nonReentrant {
		require(_isMultiple(value), "violates granularity");
		// Transfer Blocked - Token granularity
		require(to != address(0), "zero address");
		// Transfer Blocked - Receiver not eligible

		require(hasRole(bytes32("ISSUER"), _msgSender()), "!ISSUER");

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
	 * INFO instead of setting the controllers here, we set admin roles in Administrable constructor
	 */
	// function _setControllers(address[] memory operators) internal {}
}
