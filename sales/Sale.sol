pragma solidity 0.6.6;

// TODO update to 0.8.16, update dependency contracts, get rid of SafeMath (not needed after 0.8.0)
import "../contracts/constraints/WhitelistConstraintModule.sol";
import "../contracts/interfaces/ISecurityToken.sol";

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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
			sender = msg.sender;
		}
		return sender;
	}
}

contract Sale is ContextMixin, ReentrancyGuard {
	using SafeMath for uint256;

	address public issuer;

	ISecurityToken private _securityToken;
	WhitelistConstraintModule private _whitelist;

	mapping(address => uint256) private _purchases;
	mapping(address => uint256) private _limits;

	// address: address of the token contract managing the currency
	// uint256: rate, amount of tokens purchased per smallest unit of this currency
	// i.e. 1 USDC = 1 token --> rate = 10^6 (USDC has 6 decimals)
	mapping(address => uint256) private _currencyRates;

	address[] private _buyers;

	// maximum amount of tokens that can be sold
	// could be different than token cap
	uint256 public cap;

	// counts amount of tokens sold
	uint256 public sold;

	// unix timestamp of time the sale will be closed and distribute function can be called
	uint256 public primaryMarketEnd;

	bytes32 public partition;

	bool public distributed;

	event TokenPurchase(
		address indexed purchaser,
		address indexed beneficiary,
		uint256 value,
		address paymentToken,
		uint256 amount
	);

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
	) public ReentrancyGuard() {
		require(issuerWallet != address(0), "issuerWallet zero");
		// TODO check if contract, or even if securityToken
		require(tokenAddress != address(0), "tokenAddress zero");
		// TODO check if contract, or even if whitelist
		require(whitelistAddress != address(0), "whitelistAddress zero");
		require(
			now < primaryMarketEndTimestamp,
			"primary market end int the past"
		);

		issuer = issuerWallet;
		_securityToken = ISecurityToken(tokenAddress);
		_whitelist = WhitelistConstraintModule(whitelistAddress);
		primaryMarketEnd = primaryMarketEndTimestamp;
		cap = tokenCap;
		partition = defaultPartition;
	}

	function purchaseTokenWithAllowance(address currencyAddress, uint256 amount)
		public
		nonReentrant
	{
		ICurrency currency = ICurrency(currencyAddress);

		// check primary market end
		require(now < primaryMarketEnd, "primary market already ended");

		// check whitelist
		require(_whitelist.isWhitelisted(msgSender()), "buyer not whitelisted");

		// check cap
		require(sold.add(amount) < cap, "would exceed sales cap");

		// check limits
		require(
			_limits[msgSender()].sub(amount) > 0,
			"exceeds allowed purchase limit for this buyer"
		);

		// currency must be accepted
		require(
			_currencyRates[currencyAddress] > 0,
			"this stablecoin is not accepted"
		);

		// calculate currency amount needed based on rate
		uint256 currencyNeeded = _currencyRates[currencyAddress].mul(amount);

		// check allowance
		require(
			currency.allowance(address(this), msgSender()) >= currencyNeeded,
			"stablecoin allowance too low"
		);

		// send payment directly to issuer
		currency.transferFrom(msgSender(), issuer, currencyNeeded);

		// register purchase
		addPurchase(msgSender(), amount);

		// add to sold
		sold = sold.add(amount);

		// sub from _limits
		_limits[msgSender()] = _limits[msgSender()].sub(amount);

		emit TokenPurchase(
			msgSender(),
			issuer,
			currencyNeeded,
			currencyAddress,
			amount
		);
	}

	// TODO draft, maybe increase bulkmint limit in securityToken impl
	function distributeTokens() public nonReentrant {
		require(now >= primaryMarketEnd, "primary market has not ended yet");

		// prevent from being called multiple times
		// default boolean value is false
		require(!distributed, "already distributed");

		address[] memory buyersSubset;
		uint256[] memory amountsSubset;
		uint256 index;

		for (uint256 i = 0; i < _buyers.length.add(100); i.add(100)) {
			index = 0;
			for (uint256 y = i; y < _buyers.length; y.add(1)) {
				buyersSubset[index] = _buyers[y];
				amountsSubset[index] = _purchases[_buyers[y]];
				index.add(1);
			}
			_securityToken.bulkIssueByPartition(
				partition,
				buyersSubset,
				amountsSubset,
				"0x"
			);
			delete buyersSubset;
			delete amountsSubset;
		}

		distributed = true;
	}

	function addFiatPurchase(address buyer, uint256 amount)
		public
		onlySaleAdmin
	{
		require(buyer != address(0), "buyer is zero");

		_purchases[buyer] = amount;
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

	function addPurchase(address buyer, uint256 amount) private onlySaleAdmin {
		require(buyer != address(0), "buyer is zero");

		_purchases[buyer] = _purchases[buyer].add(amount);
		_buyers.push(buyer);
	}

	function cancelPurchase(address buyer, uint256 amount)
		public
		onlySaleAdmin
	{
		require(buyer != address(0), "buyer is zero");

		// subtracting a specific amount makes it possible to cancel only some of a _buyers purchases
		_purchases[buyer] = _purchases[buyer].sub(amount);
	}

	function editPrimaryMarketEnd(uint256 newPrimaryMarketEndTimestamp)
		public
		onlySaleAdmin
	{
		require(now < newPrimaryMarketEndTimestamp, "not in future");

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
