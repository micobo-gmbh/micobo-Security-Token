pragma solidity 0.5.0;

import "./ERC1400.sol";

/**
 * @author openzeppelin
 * @title Capped token
 * @dev token with a total cap and partition specific caps.
 * Cap cannot be changed afterwards.
 */
contract ERC1400ERC20Capped is ERC1400 {

    uint256 private _cap;

    mapping(bytes32 => uint256) private _capByPartition;

    /**
     * @dev See `ERC1400ERC20._issue`.
     *
     * Requirements:
     *
     * - `value` must not cause the total supply to go over the cap.
     */
    modifier _doesNotExceedCap(
        bytes32 partition,
        uint256 value)
    {
        require(totalSupply().add(value) <= _cap, 'totalSupply would exceed cap');

        // capByPartition needs to be either unset (0)
        // or greater or equal to the new _totalSupplyByPartition
        require(
            _capByPartition[partition] == 0
            || _totalSupplyByPartition[partition].add(value) <= _capByPartition[partition],
            'totalSupplyByPartition would exceed capByPartition'
        );

        _;
    }

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
    constructor (uint256 initialCap) public {
        require(initialCap > 0, 'cap must be greater than zero');
        _cap = initialCap;
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view returns (uint256) {
        return _cap;
    }

    function capByPartition(bytes32 partition) public view returns (uint256) {
        return _capByPartition[partition];
    }

    function setCap(uint256 newCap) onlyRole(5) external {
        require((newCap > _cap), 'cap must be greater than old one');
        _cap = newCap;
    }

    function setCapByPartition(bytes32 partition, uint256 newPartitionCap) onlyRole(5) external {
        require((newPartitionCap > _capByPartition[partition]), 'cap must be greater than old one');
        _capByPartition[partition] = newPartitionCap;
    }
}
