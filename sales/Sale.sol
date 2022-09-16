// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../contracts/interfaces/IWhitelistConstraintModule.sol";
import "../contracts/interfaces/ISecurityToken.sol";

import "./utils/ReentrancyGuard.sol";

interface ICurrency {
	function allowance(address owner, address spender)
		external
		view
		returns (uint256);

	function transferFrom(
		address sender,
		address recipient,
		uint256 amount
	) external returns (bool);
}

// TODO activate full MetaTransactions
contract ContextMixin {
	function msgSender() internal view returns (address payable sender) {
		if (msg.sender == address(this)) {
			bytes memory array = msg.data;
			uint256 index = msg.data.length;
			assembly {
				// Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
				sender := and(
					mload(add(array, index)),
					0xffffffffffffffffffffffffffffffffffffffff
				)
			}
		} else {
			sender = payable(msg.sender);
		}
		return sender;
	}
}

contract Sale is ContextMixin, ReentrancyGuard {
	address public issuer;

	ISecurityToken private _securityToken;
	IWhitelistConstraintModule private _whitelist;

	mapping(address => uint256) private _purchases;
	mapping(address => uint256) private _limits;

	// address: address of the token contract managing the currency
	// uint256: rate, amount of the smallest unit of this currency necessary to buy 1 token
	// rate = 10^unit (where unit is the smallest possible unit of the currency)
	// i.e. 1,000000 USDC = 1 token --> rate = 10^6 (USDC has 6 decimals)
	mapping(address => uint256) private _currencyRates;

	address[] private _buyers;

	// maximum amount of tokens that can be sold
	// could be different than token cap
	uint256 public cap;

	// counts amount of tokens sold
	uint256 public sold;

	// unix timestamp of time the sale will be closed and claim function can be called
	uint256 public primaryMarketEnd;

	bytes32 public partition;

	event TokenPurchase(
		address indexed buyer,
		address indexed beneficiary,
		uint256 value,
		address paymentToken,
		uint256 amount
	);

	event TokenClaim(address indexed buyer, uint256 value);

	event CurrencyRatesEdited(address tokenAddress, uint256 rate);

	event OwnershipTransferred(
		address indexed previousOwner,
		address indexed newOwner
	);

	constructor(
		address issuerWallet,
		address tokenAddress,
		address whitelistAddress,
		uint256 primaryMarketEndTimestamp,
		uint256 tokenCap,
		bytes32 defaultPartition
	) ReentrancyGuard() {
		require(issuerWallet != address(0), "issuerWallet zero");
		// TODO check if contract, or even if securityToken
		require(tokenAddress != address(0), "tokenAddress zero");
		// TODO check if contract, or even if whitelist
		require(whitelistAddress != address(0), "whitelistAddress zero");
		require(
			block.timestamp < primaryMarketEndTimestamp,
			"primary market end in the past"
		);

		issuer = issuerWallet;
		_securityToken = ISecurityToken(tokenAddress);
		_whitelist = IWhitelistConstraintModule(whitelistAddress);
		primaryMarketEnd = primaryMarketEndTimestamp;
		cap = tokenCap;
		partition = defaultPartition;
	}

	function purchaseTokenWithAllowance(address currencyAddress, uint256 amount)
		public
		nonReentrant
	{
		ICurrency currency = ICurrency(currencyAddress);

		// currency must be accepted
		require(
			_currencyRates[currencyAddress] > 0,
			"this stablecoin is not accepted"
		);

		// calculate currency amount needed based on rate
		uint256 currencyNeeded = _currencyRates[currencyAddress] * amount;

		// check allowance
		require(
			currency.allowance(msgSender(), address(this)) >= currencyNeeded,
			"stablecoin allowance too low"
		);

		// send payment directly to issuer
		currency.transferFrom(msgSender(), issuer, currencyNeeded);

		// register purchase
		_addPurchase(msgSender(), amount);

		emit TokenPurchase(
			msgSender(),
			issuer,
			currencyNeeded,
			currencyAddress,
			amount
		);
	}

	function claimTokens() public nonReentrant {
		require(
			block.timestamp >= primaryMarketEnd,
			"primary market has not ended yet"
		);

		uint256 amountClaimable = _purchases[msgSender()];

		require(amountClaimable > 0, "no tokens to claim");

		_purchases[msgSender()] = 0;

		_securityToken.issueByPartition(partition, msgSender(), amountClaimable, "0x");

		emit TokenClaim(msgSender(), amountClaimable);
	}

	function addFiatPurchase(address buyer, uint256 amount)
		public
		onlySaleAdmin
	{
		_addPurchase(buyer, amount);
	}

	function editPurchaseLimits(address buyer, uint256 amount)
		public
		onlySaleAdmin
	{
		require(buyer != address(0), "buyer is zero");

		_limits[buyer] = amount;
	}

	function editCurrencyRates(address currencyAddress, uint256 rate)
		public
		onlySaleAdmin
	{
		// setting the rate back to the default (0) will deactivate the currency
		require(currencyAddress != address(0), "currencyAddress is zero");

		_currencyRates[currencyAddress] = rate;

		emit CurrencyRatesEdited(currencyAddress, rate);
	}

	function _addPurchase(address buyer, uint256 amount) private {
		require(buyer != address(0), "buyer is zero");

		// check primary market end
		require(
			block.timestamp < primaryMarketEnd,
			"primary market already ended"
		);

		// check whitelist
		require(_whitelist.isWhitelisted(buyer), "buyer not whitelisted");

		// check cap
		require(sold + amount < cap, "would exceed sales cap");

		// check limits
		require(
			_limits[buyer] >= amount,
			"exceeds purchase limit for buyer"
		);

		// add to sold
		sold = sold + amount;

		// sub from _limits
		_limits[buyer] = _limits[buyer] - amount;

		// register purchase
		_purchases[buyer] = _purchases[buyer] + amount;

		// add buyer address to array
		_buyers.push(buyer);
	}

	function cancelPurchase(address buyer, uint256 amount)
		public
		onlySaleAdmin
	{
		require(buyer != address(0), "buyer is zero");

		require(_purchases[buyer] >= amount, "amount too high");

		// subtracting a specific amount makes it possible to cancel only some of a _buyers purchases
		_purchases[buyer] = _purchases[buyer] - amount;
	}

	function editPrimaryMarketEnd(uint256 newPrimaryMarketEndTimestamp)
		public
		onlySaleAdmin
	{
		require(
			block.timestamp < newPrimaryMarketEndTimestamp,
			"not in future"
		);

		primaryMarketEnd = newPrimaryMarketEndTimestamp;
	}

	// read functions for private types
	function getTokenAddress() external view returns (address tokenAddress) {
		return address(_securityToken);
	}

	function getWhitelistAddress()
		external
		view
		returns (address whitelistAddress)
	{
		return address(_whitelist);
	}

	function getPurchase(address buyer) external view returns (uint256 amount) {
		return _purchases[buyer];
	}

	function getLimit(address buyer) external view returns (uint256 limit) {
		return _limits[buyer];
	}

	function getCurrencyRate(address currencyAddress)
		external
		view
		returns (uint256 rate)
	{
		return _currencyRates[currencyAddress];
	}

	function getBuyers() external view returns (address[] memory buyers) {
		return _buyers;
	}

	/**
	 * @dev Throws if called by any account other than the owner.
	 */
	modifier onlySaleAdmin() {
		require(
			_securityToken.hasRole(bytes32("SALE_ADMIN"), msgSender()),
			"!SALE_ADMIN"
		);
		_;
	}
}
