// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../contracts/interfaces/IWhitelistConstraintModule.sol";
import "../contracts/interfaces/ISecurityToken.sol";
import "./interfaces/ICurrency.sol";
import "./utils/ContextMixin.sol";
import "./utils/ReentrancyGuard.sol";

// TODO activate full MetaTransactions

abstract contract Sale is ContextMixin, ReentrancyGuard {
	address public issuer;

	ISecurityToken internal _securityToken;
	IWhitelistConstraintModule internal _whitelist;

	mapping(address => uint256) internal _purchases;
	mapping(address => uint256) internal _limits;

	// address: address of the token contract managing the currency
	// uint256: rate, amount of the smallest unit of this currency necessary to buy 1 token
	// rate = 10^unit (where unit is the smallest possible unit of the currency)
	// i.e. 1,000000 USDC = 1 token --> rate = 10^6 (USDC has 6 decimals)
	mapping(address => uint256) internal _currencyRates;

	address[] internal _buyers;

	// maximum amount of tokens that can be sold
	// could be different than token cap
	uint256 public cap;

	// counts amount of tokens sold
	uint256 public sold;

	// unix timestamp of time the sale will be closed and claim function can be called
	uint256 public primaryMarketEnd;

	bytes32 public partition;

	address public premintAddress;

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
		bytes32 defaultPartition,
		address premintWallet
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
		premintAddress = premintWallet;
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

	// implement in contracts who inherit from this
	function _addPurchase(address buyer, uint256 amount) internal virtual;

	function issueTokens(address buyer, uint256 amount) internal {
		if (premintAddress == address(0)) {
			_securityToken.issueByPartition(partition, buyer, amount, "0x");
		} else {
			_securityToken.operatorTransferByPartition(
				partition,
				premintAddress,
				buyer,
				amount,
				"0x",
				"0x"
			);
		}
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
