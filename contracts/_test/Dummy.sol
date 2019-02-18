pragma solidity ^0.5.0;

contract Dummy {
    address impl;

    constructor (address _impl) public {
        impl = _impl;
    }

    function() external {
        require(msg.sig != 0x0);
        address _impl = impl;
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, ptr, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return (ptr, size)}
        }
    }

    //This function can make the current instance upgradeable, instead of only newly spawned instances
    // Acces control not included for simplicity (you could use Ownable.sol from OpenZeppelin)
    function changeImplementation(address _impl) public {
        impl = _impl;
    }
}