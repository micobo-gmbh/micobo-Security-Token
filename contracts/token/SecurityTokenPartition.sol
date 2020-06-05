pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/ISecurityToken.sol";
import "../gsn/GSNable.sol";
import "../erc1820/ERC1820Client.sol";


/**
 * @author Simon Dosch
 * @title SecurityTokenPartition
 * @dev Acts as an ERC20 compatible proxy contract
 * to control ERC1400 partitions
 */
contract SecurityTokenPartition is IERC20, ERC1820Client, GSNable {
	using SafeMath for uint256;

	/**
	 * @dev Address of securityToken this SecurityTokenPartition is used for
	 */
	ISecurityToken internal _securityToken;

	/**
	 * @dev id of partition this SecurityTokenPartition is used for
	 */
	bytes32 internal _partitionId;

	/**
	 * [SecurityTokenPartition CONSTRUCTOR]
	 * @dev Initialize SecurityTokenPartition with security token address and partition
	 * @param securityTokenAddress Address of securityToken this SecurityTokenPartition is used for
	 * @param partition id of partition this SecurityTokenPartition is used for
	 */
	constructor(address securityTokenAddress, bytes32 partition) public {
		setInterfaceImplementation("ERC20Token", address(this));

		_securityToken = ISecurityToken(securityTokenAddress);
		_partitionId = partition;
	}

	/**
	 * @dev Returns security token address
	 * @return ISecurityToken address of the securit token
	 */
	function securityTokenAddress() external view returns (ISecurityToken) {
		return _securityToken;
	}

	/**
	 * @dev Returns partition id
	 * @return bytes32 partition id of the securit token partition
	 */
	function partitionId() external view returns (bytes32) {
		return _partitionId;
	}

	/**
	 * @dev Returns the cap on the token's total supply.
	 */
	function cap() external view returns (uint256) {
		return _securityToken.cap();
	}

	//******************/
	// ERC20Detailed
	//******************/

	/**
	 * @dev Returns the name of the token.
	 */
	function name() external view returns (string memory) {
		return _securityToken.name();
	}

	/**
	 * @dev Returns the symbol of the token, usually a shorter version of the
	 * name.
	 */
	function symbol() external view returns (string memory) {
		return _securityToken.symbol();
	}

	/**
	 * @dev Returns the ERC20 decimal property as 18
	 * @return uint8 Always returns decimals as 18
	 */
	function decimals() external pure returns (uint8) {
		return uint8(18);
	}

	//******************/
	// ERC20
	//******************/

	/**
	 * @dev Mapping from (tokenHolder, spender) to allowed value.
	 */
	mapping(address => mapping(address => uint256)) internal _allowances;

	function transfer(address to, uint256 value)
		external
		override
		returns (bool)
	{
		// transferByPartition contains "_msgSender()", which would be THIS contract's address
		// this is why this contract is a controllerByPartition so we can still make transfers.
		_securityToken.operatorTransferByPartition(
			_partitionId,
			_msgSender(),
			to,
			value,
			"",
			""
		);
		return true;
	}

	/**
	 * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits an {Approval} event.
	 */
	function approve(address spender, uint256 value)
		external
		override
		returns (bool)
	{
		require(spender != address(0), "A5");
		// Transfer Blocked - Sender not eligible
		_allowances[_msgSender()][spender] = value;
		emit Approval(_msgSender(), spender, value);
		return true;
	}

	/**
	 * @dev Moves `amount` tokens from `sender` to `recipient` using the
	 * allowance mechanism. `amount` is then deducted from the caller's
	 * allowance.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits a {Transfer} event.
	 */
	function transferFrom(
		address from,
		address to,
		uint256 value
	) external override returns (bool) {
		// check if has enough allowance here
		require(value <= _allowances[from][_msgSender()], "A7");
		// Transfer Blocked - Identity restriction

		_allowances[from][_msgSender()] = _allowances[from][_msgSender()].sub(
			value
		);

		// transfer by partition
		_securityToken.operatorTransferByPartition(
			_partitionId,
			from,
			to,
			value,
			"",
			""
		);

		emit Transfer(from, to, value);
		return true;
	}

	/**
	 * @dev Returns the amount of tokens in existence.
	 */
	function totalSupply() external override(IERC20) view returns (uint256) {
		return _securityToken.totalSupplyByPartition(_partitionId);
	}

	/**
	 * @dev Returns the amount of tokens owned by `account`.
	 */
	function balanceOf(address who)
		external
		override(IERC20)
		view
		returns (uint256)
	{
		return _securityToken.balanceOfByPartition(_partitionId, who);
	}

	/**
	 * @dev Returns the remaining number of tokens that `spender` will be
	 * allowed to spend on behalf of `owner` through {transferFrom}. This is
	 * zero by default.
	 *
	 * This value changes when {approve} or {transferFrom} are called.
	 */
	function allowance(address owner, address spender)
		external
		override
		view
		returns (uint256)
	{
		return _allowances[owner][spender];
	}

	// GSN
	/**
	 * @dev Adding access control by overriding this function!
	 * @return true if sender is GSN_CONTROLLER
	 */
	function _isGSNController() internal override view returns (bool) {
		return _securityToken.hasRole(bytes32("GSN_CONTROLLER"), _msgSender());
	}
}
