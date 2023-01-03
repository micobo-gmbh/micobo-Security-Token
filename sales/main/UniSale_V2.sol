// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../../contracts/interfaces/IWhitelistConstraintModule.sol";
import "../../contracts/interfaces/ISecurityToken.sol";
import "../interfaces/ICurrency.sol";
import "../interfaces/ERC1820Client.sol";
import "../utils/ReentrancyGuard.sol";
import "../utils/NativeMetaTransaction.sol";

contract UniSale_V2 is NativeMetaTransaction, ReentrancyGuard, ERC1820Client {
	struct SalesChannel {
		// token will be force-transferred from this address. If 0, tokens will be minted.
		address issuer;
		// this whitelist will be checked before each purpose. If 0, no check is done.
		IWhitelistConstraintModule whitelist;
		// buyers array
		address[] buyers;
		// maximum amount of tokens that can be sold
		// could be different than token cap
		uint256 cap;
		// counts amount of tokens sold
		uint256 sold;
		// unix timestamp of time the sale will be closed and claim function can be called
		uint256 primaryMarketEndTimestamp;
		// if premintAddress is 0x0, tokens will be minted when distributed
		address premintAddress;
		// wether this partition is sold deferred
		bool useDeferredMinting;
		// used to keep track of distribution
		uint256 distributeCounter;
		// wether limits are used or not
		bool useLimit;
		// userAddress => limit
		mapping(address => uint256) limits;
		// rate: amount of the smallest unit of this currency necessary to buy 1 token
		// rate = 10^unit (where unit is the smallest possible unit of the currency)
		// i.e. 1,000000 USDC = 1 token --> rate = 10^6 (USDC has 6 decimals)
		// currencyAddress => rate
		mapping(address => uint256) rates;
		// userAddress => purchaseAmount
		mapping(address => uint256) purchases;
	}

	// tokenAddress => partition => SalesChannel
	mapping(address => mapping(bytes32 => SalesChannel)) private _channels;

	// fees in percentage points
	mapping(address => mapping(bytes32 => uint256)) fees;
	// fee destinations, fees will be sent here
	mapping(address => mapping(bytes32 => address)) feeDestinations;

	event TokenPurchase(
		address indexed buyer,
		address tokenAddress,
		uint256 value,
		address currencyToken,
		uint256 amount,
		bytes32 partition
	);

	event TokenClaim(address tokenAddress, bytes32 partition, address indexed buyer, uint256 value);

	event CurrencyRatesEdited(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress,
		uint256 rate
	);

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	constructor() {
		_initializeEIP712("UniSale - Security Tokens Primary Market");
	}

	function addSalesChannel(
		address tokenAddress,
		address issuerWallet,
		address whitelistAddress,
		uint256 primaryMarketEndTimestamp,
		uint256 salesCap,
		bytes32 partition,
		address premintWallet,
		address currencyAddress,
		uint256 rate,
		bool useDeferredMinting,
		bool useLimit
	) public {
		require(issuerWallet != address(0), "issuerWallet zero");
		require(
			ERC1820Client.getInterfaceImplementer(tokenAddress, "ERC1400Token") == tokenAddress,
			"token is not ERC1400 compatible"
		);
		require(isContract(whitelistAddress), "whitelist is not a contract");
		require(block.timestamp < primaryMarketEndTimestamp, "primary market end in the past");
		require(rate > 0, "rate cannot be 0");

		ISecurityToken _securityToken = ISecurityToken(tokenAddress);
		require(_securityToken.hasRole(bytes32("SALE_ADMIN"), msgSender()), "!SALE_ADMIN");

		SalesChannel storage salesChannel = _channels[tokenAddress][partition];

		salesChannel.issuer = issuerWallet;
		salesChannel.whitelist = IWhitelistConstraintModule(whitelistAddress);
		salesChannel.primaryMarketEndTimestamp = primaryMarketEndTimestamp;
		salesChannel.cap = salesCap;
		salesChannel.premintAddress = premintWallet;
		salesChannel.useDeferredMinting = useDeferredMinting;
		salesChannel.useLimit = useLimit;

		editCurrencyRates(tokenAddress, partition, currencyAddress, rate);
	}

	function deleteSalesChannel(address tokenAddress, bytes32 partition)
		public
		onlySaleAdmin(tokenAddress)
	{
		delete _channels[tokenAddress][partition];
	}

	function purchaseTokenWithAllowance(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress,
		uint256 amount
	) public nonReentrant {
		ICurrency currency = ICurrency(currencyAddress);

		// currency must be accepted
		require(
			_channels[tokenAddress][partition].rates[currencyAddress] > 0,
			"this stablecoin is not accepted"
		);

		// calculate currency amount needed based on rate, amount and fee
		uint256 feeAmount = 0;

		uint256 currencyNeeded = _channels[tokenAddress][partition].rates[currencyAddress] * amount;

		if (fees[tokenAddress][partition] > 0) {
			if (currencyNeeded > (fees[tokenAddress][partition] / 100)) {
				feeAmount = (fees[tokenAddress][partition] / 100) * currencyNeeded;
			}
		}

		// check allowance
		require(
			currency.allowance(msgSender(), address(this)) >= currencyNeeded + feeAmount,
			"stablecoin allowance too low"
		);

		// register purchase
		_addPurchase(tokenAddress, partition, msgSender(), amount);

		// send payment directly to issuer
		currency.transferFrom(
			msgSender(),
			_channels[tokenAddress][partition].issuer,
			currencyNeeded
		);

		if (feeAmount > 0) {
			// send fee directly to feeDestination
			currency.transferFrom(msgSender(), feeDestinations[tokenAddress][partition], feeAmount);
		}

		emit TokenPurchase(
			msgSender(),
			tokenAddress,
			currencyNeeded,
			currencyAddress,
			amount,
			partition
		);
	}

	function purchaseWithAuthorization(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress,
		uint256 amount,
		address userAddress,
		bytes32 sigR,
		bytes32 sigS,
		uint8 sigV
	) public nonReentrant {
		ICurrency currency = ICurrency(currencyAddress);

		// currency must be accepted
		require(
			_channels[tokenAddress][partition].rates[currencyAddress] > 0,
			"this stablecoin is not accepted"
		);

		// calculate currency amount needed based on rate, amount and fee
		/* uint256 feeAmount = 0; */

		uint256 currencyNeeded = _channels[tokenAddress][partition].rates[currencyAddress] * amount;

		/* if (fees[tokenAddress][partition] > 0) {
			if (currencyNeeded > (fees[tokenAddress][partition] / 100)) {
				feeAmount = (fees[tokenAddress][partition] / 100) * currencyNeeded;
			}
		} */

		// create the expected function signature
		bytes memory calculatedFunctionSignature = abi.encodeWithSignature(
			"transfer(address,uint256)",
			address(this),
			currencyNeeded /* + feeAmount */
		);

		// check balance
		require(
			currency.balanceOf(userAddress) >= currencyNeeded /* + feeAmount */,
			"stablecoin balance too low"
		);

		// register purchase, issue tokens or record purchase
		_addPurchase(tokenAddress, partition, userAddress, amount);

		// get payment (includes fee)
		currency.executeMetaTransaction(userAddress, calculatedFunctionSignature, sigR, sigS, sigV);

		// transfer price to issuer
		currency.transfer(_channels[tokenAddress][partition].issuer, currencyNeeded);

		// transfer fee
		/* if (feeAmount > 0) {
			currency.transfer(feeDestinations[tokenAddress][partition], feeAmount);
		} */

		emit TokenPurchase(
			userAddress,
			tokenAddress,
			currencyNeeded,
			currencyAddress,
			amount,
			partition
		);
	}

	function calculatePrice(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress,
		uint256 amount
	) public view returns (uint256 currencyNeeded, uint256 feeAmount) {
		// calculate currency needed based on rate and token amount
		currencyNeeded = _channels[tokenAddress][partition].rates[currencyAddress] * amount;

		if (fees[tokenAddress][partition] > 0) {
			if (currencyNeeded > (fees[tokenAddress][partition] / 100)) {
				feeAmount = (fees[tokenAddress][partition] / 100) * currencyNeeded;
			}
		}

		return (currencyNeeded, feeAmount);
	}

	function addFiatPurchase(
		address tokenAddress,
		bytes32 partition,
		address buyer,
		uint256 amount
	) public onlySaleAdmin(tokenAddress) {
		_addPurchase(tokenAddress, partition, buyer, amount);
	}

	function claimTokens(address tokenAddress, bytes32 partition) public nonReentrant {
		require(
			block.timestamp >= _channels[tokenAddress][partition].primaryMarketEndTimestamp,
			"primary market has not ended yet"
		);

		uint256 amountClaimable = _channels[tokenAddress][partition].purchases[msgSender()];

		require(amountClaimable > 0, "no tokens to claim");

		_channels[tokenAddress][partition].purchases[msgSender()] = 0;

		// ISSUE TOKENS
		_issueTokens(tokenAddress, partition, msgSender(), amountClaimable);

		emit TokenClaim(tokenAddress, partition, msgSender(), amountClaimable);
	}

	function distributeTokens(
		address tokenAddress,
		bytes32 partition,
		uint256 batchSize
	) public nonReentrant {
		require(
			block.timestamp >= _channels[tokenAddress][partition].primaryMarketEndTimestamp,
			"primary market has not ended yet"
		);

		uint256 end;

		uint256 dc = _channels[tokenAddress][partition].distributeCounter;

		uint256 length = _channels[tokenAddress][partition].buyers.length;

		if (dc < length) {
			end = dc + batchSize;
		} else {
			revert("done distributing");
		}

		if (end > length) {
			end = length;
		}

		ISecurityToken _securityToken = ISecurityToken(tokenAddress);

		if (_channels[tokenAddress][partition].premintAddress == address(0)) {
			for (; dc < end; dc++) {
				address investor = _channels[tokenAddress][partition].buyers[dc];

				// distribute tokens
				_securityToken.issueByPartition(
					partition,
					investor,
					_channels[tokenAddress][partition].purchases[investor],
					"0x"
				);

				_channels[tokenAddress][partition].purchases[investor] = 0;
			}
		} else {
			for (; dc < end; dc++) {
				address investor = _channels[tokenAddress][partition].buyers[dc];

				// distribute tokens
				_securityToken.operatorTransferByPartition(
					partition,
					_channels[tokenAddress][partition].premintAddress,
					investor,
					_channels[tokenAddress][partition].purchases[investor],
					"0x",
					"0x"
				);

				_channels[tokenAddress][partition].purchases[investor] = 0;
			}
		}

		_channels[tokenAddress][partition].distributeCounter = dc;
	}

	function cancelPurchase(
		address tokenAddress,
		bytes32 partition,
		address buyer,
		uint256 amount
	) public onlySaleAdmin(tokenAddress) {
		require(_channels[tokenAddress][partition].purchases[buyer] >= amount, "amount too high");

		// subtracting a specific amount makes it possible to cancel only some of a _buyers purchases
		_channels[tokenAddress][partition].purchases[buyer] -= amount;
	}

	function setFee(
		address tokenAddress,
		bytes32 partition,
		uint256 fee,
		address feeDestination
	) public onlySaleAdmin(tokenAddress) {
		require(feeDestination != address(0), "feeDestination is zero");

		fees[tokenAddress][partition] = fee;
		feeDestinations[tokenAddress][partition] = feeDestination;
	}

	function editPurchaseLimits(
		address tokenAddress,
		bytes32 partition,
		address buyer,
		uint256 amount
	) public onlySaleAdmin(tokenAddress) {
		require(buyer != address(0), "buyer is zero");

		_channels[tokenAddress][partition].limits[buyer] = amount;
	}

	function editCurrencyRates(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress,
		uint256 rate
	) public onlySaleAdmin(tokenAddress) {
		require(rate > 0, "rate cannot be 0");

		_channels[tokenAddress][partition].rates[currencyAddress] = rate;

		emit CurrencyRatesEdited(tokenAddress, partition, currencyAddress, rate);
	}

	function _addPurchase(
		address tokenAddress,
		bytes32 partition,
		address buyer,
		uint256 amount
	) internal {
		require(buyer != address(0), "buyer is zero");

		// check primary market, if set
		if (_channels[tokenAddress][partition].primaryMarketEndTimestamp != 0) {
			require(
				block.timestamp < _channels[tokenAddress][partition].primaryMarketEndTimestamp,
				"primary market already ended"
			);
		}

		// check whitelist, if used
		if (address(_channels[tokenAddress][partition].whitelist) != address(0)) {
			require(
				_channels[tokenAddress][partition].whitelist.isWhitelisted(buyer),
				"buyer not whitelisted"
			);
		}

		// check cap, if set
		if (_channels[tokenAddress][partition].cap != 0) {
			require(
				_channels[tokenAddress][partition].sold + amount <
					_channels[tokenAddress][partition].cap,
				"would exceed sales cap"
			);
		}

		// check limits, if set
		if (_channels[tokenAddress][partition].useLimit) {
			require(
				_channels[tokenAddress][partition].limits[buyer] >= amount,
				"exceeds purchase limit for buyer"
			);
			// sub from _limits
			_channels[tokenAddress][partition].limits[buyer] -= amount;
		}

		// add to sold
		_channels[tokenAddress][partition].sold = _channels[tokenAddress][partition].sold + amount;

		// add buyer address to array
		_channels[tokenAddress][partition].buyers.push(buyer);

		if (!_channels[tokenAddress][partition].useDeferredMinting) {
			// Instant Minting, issue tokens
			_issueTokens(tokenAddress, partition, buyer, amount);
		} else {
			// Deferred Minting, register purchase
			_channels[tokenAddress][partition].purchases[buyer] += amount;
		}
	}

	function _issueTokens(
		address tokenAddress,
		bytes32 partition,
		address buyer,
		uint256 amount
	) internal {
		ISecurityToken securityToken = ISecurityToken(tokenAddress);

		if (_channels[tokenAddress][partition].premintAddress == address(0)) {
			securityToken.issueByPartition(partition, buyer, amount, "0x");
		} else {
			securityToken.operatorTransferByPartition(
				partition,
				_channels[tokenAddress][partition].premintAddress,
				buyer,
				amount,
				"0x",
				"0x"
			);
		}
	}

	function editPrimaryMarketEnd(
		address tokenAddress,
		bytes32 partition,
		uint256 newPrimaryMarketEndTimestamp
	) public onlySaleAdmin(tokenAddress) {
		require(block.timestamp < newPrimaryMarketEndTimestamp, "not in future");

		_channels[tokenAddress][partition].primaryMarketEndTimestamp = newPrimaryMarketEndTimestamp;
	}

	// read functions for private types

	function getWhitelistAddress(address tokenAddress, bytes32 partition)
		external
		view
		returns (address whitelistAddress)
	{
		return address(_channels[tokenAddress][partition].whitelist);
	}

	function getPurchase(
		address tokenAddress,
		bytes32 partition,
		address buyer
	) external view returns (uint256 amount) {
		return _channels[tokenAddress][partition].purchases[buyer];
	}

	function getLimit(
		address tokenAddress,
		bytes32 partition,
		address buyer
	) external view returns (uint256 limit) {
		return _channels[tokenAddress][partition].limits[buyer];
	}

	function getCurrencyRate(
		address tokenAddress,
		bytes32 partition,
		address currencyAddress
	) external view returns (uint256 rate) {
		return _channels[tokenAddress][partition].rates[currencyAddress];
	}

	function getPrimaryMarketEndTimestamp(address tokenAddress, bytes32 partition)
		external
		view
		returns (uint256 primaryMarketEndTimestamp)
	{
		return _channels[tokenAddress][partition].primaryMarketEndTimestamp;
	}

	function getBuyers(address tokenAddress, bytes32 partition)
		external
		view
		returns (address[] memory buyers)
	{
		return _channels[tokenAddress][partition].buyers;
	}

	/**
	 * @dev Throws if called by any account other than the owner.
	 */
	modifier onlySaleAdmin(address tokenAddress) {
		ISecurityToken _securityToken = ISecurityToken(tokenAddress);
		require(_securityToken.hasRole(bytes32("SALE_ADMIN"), msgSender()), "!SALE_ADMIN");
		_;
	}

	function isContract(address account) internal view returns (bool) {
		// This method relies in extcodesize, which returns 0 for contracts in
		// construction, since the code is only stored at the end of the
		// constructor execution.

		uint256 size;
		// solhint-disable-next-line no-inline-assembly
		assembly {
			size := extcodesize(account)
		}
		return size > 0;
	}
}
