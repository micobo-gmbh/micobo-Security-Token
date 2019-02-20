pragma solidity ^0.5.0;

contract DummyMaster {
    // resolver needs to be the first in storage to match the ConstraintsProxy contract storage ordering
    address impl;
    uint count;

    function increment() public {
        count = count + 1;
    }
    function get() external view returns (uint) {
        return count;
    }
}