// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

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