pragma solidity ^0.5.0;

interface AdministrationInterfaceForProxy {
    function isConstraintsUpdater(address account) external returns (bool);
}

contract ConstraintsProxy {

    address private constraintsLogicContract;

    AdministrationInterfaceForProxy public _admin;

    constructor (address constraintsAddress, AdministrationInterfaceForProxy adminAddress) public {
        constraintsLogicContract = constraintsAddress;
        _admin = adminAddress;
    }

    function constraintsLogicContractAddress() public view returns (address) {
        return constraintsLogicContract;
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

    modifier onlyConstraintsUpdater () {
        require(_admin.isConstraintsUpdater(msg.sender));
        _;
    }

    function updateLogicContract(address newLogic) isContract(newLogic) onlyConstraintsUpdater public returns (bool) {

        constraintsLogicContract = newLogic;
        return true;
    }

    /**
    * @dev This is the fallback function, it will be called when this contract receives a call to an unknown function
    * We use this intentionally to route function calls to our updatable logic contract.
    * This happens using assembly code and specifically the delegatecall opcode.
    * We essentially copy the calldata sent to this contract, perform the delegatecall, copy the returndata and return it.
    * The special thing to understand here is that the storage variables being manipulated reside in THIS contract
    * which is the whole point, because it is why we can update the logic contract without losing our data!
    */
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