// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../../contracts/interfaces/IWhitelistConstraintModule.sol";
import "../../contracts/interfaces/ISecurityToken.sol";
import "../interfaces/ICurrency.sol";
import "./Sale.sol";

contract SaleDeferred is Sale {
	uint256 private distributeCounter;

	constructor(
		address issuerWallet,
		address tokenAddress,
		address whitelistAddress,
		uint256 primaryMarketEndTimestamp,
		uint256 tokenCap,
		bytes32 defaultPartition,
		address premintWallet,
		string memory domainNameSeperator
	)
		Sale(
			issuerWallet,
			tokenAddress,
			whitelistAddress,
			primaryMarketEndTimestamp,
			tokenCap,
			defaultPartition,
			premintWallet,
			domainNameSeperator
		)
	{}

	function claimTokens() public nonReentrant {
		require(
			block.timestamp >= primaryMarketEnd,
			"primary market has not ended yet"
		);

		uint256 amountClaimable = _purchases[msgSender()];

		require(amountClaimable > 0, "no tokens to claim");

		_purchases[msgSender()] = 0;

		// ISSUE TOKENS
		_issueTokens(msgSender(), amountClaimable);

		emit TokenClaim(msgSender(), amountClaimable);
	}

	function distributeTokens(uint256 batchSize) public nonReentrant {
		require(
			block.timestamp >= primaryMarketEnd,
			"primary market has not ended yet"
		);

		uint256 end;

		if (distributeCounter < _buyers.length) {
			end = distributeCounter + batchSize;
		} else {
			revert("done distributing");
		}

		if (end > _buyers.length) {
			end = _buyers.length;
		}

		if (premintAddress == address(0)) {
			for (; distributeCounter < end; distributeCounter++) {
				address investor = _buyers[distributeCounter];

				// distribute tokens
				_securityToken.issueByPartition(
					partition,
					investor,
					_purchases[investor],
					"0x"
				);
				_purchases[investor] = 0;
			}
		} else {
			for (; distributeCounter < end; distributeCounter++) {
				address investor = _buyers[distributeCounter];

				// distribute tokens
				_securityToken.operatorTransferByPartition(
					partition,
					premintAddress,
					investor,
					_purchases[investor],
					"0x",
					"0x"
				);

				_purchases[investor] = 0;
			}
		}
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

	function _addPurchase(address buyer, uint256 amount) internal override {
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
		require(_limits[buyer] >= amount, "exceeds purchase limit for buyer");

		// add to sold
		sold = sold + amount;

		// sub from _limits
		_limits[buyer] = _limits[buyer] - amount;

		// register purchase
		_purchases[buyer] = _purchases[buyer] + amount;

		// add buyer address to array
		_buyers.push(buyer);
	}
}
