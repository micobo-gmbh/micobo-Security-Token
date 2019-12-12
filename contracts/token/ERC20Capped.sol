pragma solidity 0.5.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * @author openzeppelin
 * @title Capped token
 * @dev Mintable token with a token cap.
 * Cap cannot be changed afterwards.
 */
contract ERC20Capped is ERC20 {
    uint256 private _cap;

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
    constructor (uint256 cap) public {
        require(cap > 0, 'cap must be greater than zero');
        _cap = cap;
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view returns (uint256) {
        return _cap;
    }


    /**
     * @dev See `ERC20Mintable.mint`.
     *
     * Requirements:
     *
     * - `value` must not cause the total supply to go over the cap.
     */
    function _mint(address account, uint256 value) internal {
        require(totalSupply().add(value) <= _cap, 'totalSupply would exceed cap');
        super._mint(account, value);
    }
}
