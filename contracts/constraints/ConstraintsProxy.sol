pragma solidity ^0.5.0;

contract ConstraintsProxy {


    address public constraintsLogicContract;

    event DelegatecallResult(
        bytes data
    );

    constructor (address _impl) public {
        constraintsLogicContract = _impl;
    }

    function updateLogicContract(address newLogic) public returns (bool) {
        // test if address
        constraintsLogicContract = newLogic;
        return true;
    }


    //    function () payable external {
    //        (bool success, bytes memory data) = (constraintsLogicContract).delegatecall(msg.data);
    //        require(success);
    //
    //        emit DelegatecallResult(data);
    //    }

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