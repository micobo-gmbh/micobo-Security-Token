pragma solidity ^0.5.0;

contract ConstraintsProxy {


    address public constraintsLogicContract;

    constructor (address _impl) public {
        constraintsLogicContract = _impl;
    }

    /**
    * @dev See if the new address is home to a contract
    * Credit: https://github.com/Dexaran/ERC223-token-standard/blob/Recommended/ERC223_Token.sol#L107-L114
    *
    * @param a Address of the new logic contract
    */
    modifier isContract (address a) {
        uint length;
        assembly {
        // get the code size of this address, if it has code it's a contract!
            length := extcodesize(a)
        }
        require(length > 0);
        _;
    }


    function updateLogicContract(address newLogic) isContract(newLogic) public returns (bool) {

        constraintsLogicContract = newLogic;
        return true;
    }



    function() external {
        require(msg.sig != 0x0);
        address _impl = constraintsLogicContract;
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

}