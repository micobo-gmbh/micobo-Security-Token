// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../contracts/interfaces/IWhitelistConstraintModule.sol";
import "../contracts/interfaces/ISecurityToken.sol";
import "./interfaces/ICurrency.sol";
import "./utils/ContextMixin.sol";
import "./Sale.sol";

// TODO activate full MetaTransactions

contract SaleInstant is Sale {
	constructor(
		address issuerWallet,
		address tokenAddress,
		address whitelistAddress,
		uint256 primaryMarketEndTimestamp,
		uint256 tokenCap,
		bytes32 defaultPartition,
		address premintWallet
	)
		Sale(
			issuerWallet,
			tokenAddress,
			whitelistAddress,
			primaryMarketEndTimestamp,
			tokenCap,
			defaultPartition,
			premintWallet
		)
	{}

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

		// ISSUE TOKENS
		issueTokens(buyer, amount);
	}
}
