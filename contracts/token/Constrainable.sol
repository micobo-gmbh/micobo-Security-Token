pragma solidity 0.5.9;

import './Administrable.sol';
import "../interfaces/IConstraintsModule.sol";

contract Constrainable is Administrable {

    // Questions for OffChainValidator
    // ??? when data or operator data are left empty, how does OffChainValidator know which one it is supposed to check for the certificate
    // i guess we will just let it try both when in doubt
    // we need to keep this modifier open though, so the internal transfer functions can dynamically use this
    // even when some variables remain empty


    IConstraintsModule[] private _modules;

    constructor(
        address adminContract
    )
    public
    Administrable(adminContract)
    {

    }

    // ??? when data or operator data are left empty, how does OffChainValidator know which one it is supposed to check for the certificate
    // i guess we will just let it try both when in doubt
    // we need to keep this modifier open though, so the internal transfer functions can dynamically use this
    // even when some variables remain empty


    function validateTransaction(
        address sender,
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    internal
    view
    {

        for (uint i = 0; i < _modules.length; i++) {

            (bool valid, string memory message) = _modules[i].isValid(
                sender,
                partition,
                operator,
                from,
                to,
                value,
                data,
                operatorData
            );

            require(valid, message);
        }

    }

    function modules() external view returns (IConstraintsModule[] memory) {
        return _modules;
    }

    function setModules(IConstraintsModule[] calldata newModules) external {
        require(_admin.hasRole(6, msg.sender), '0x07');
        _modules = newModules;
    }

    /**
     * Adding a constraint module
     */

    /*function addModule(IConstraintsModule module) public {

        require(_admin.hasRole(6, msg.sender), 'sender is not eligible to add modules');

        *//**
         * @dev See if the new address is home to a contract
         * Credit:
         * https://github.com/Dexaran/ERC223-token-standard/blob/Recommended/ERC223_Token.sol#L107-L114
         *//**//*

        uint length;
        assembly {
        // get the code size of this address, if it has code it's a contract!
            length := extcodesize(module)
        }
        require(length > 0, 'no contract at this address');*//*

        _modules.push(module);
    }

    *//**
     * Removing a constraint module
     *//*
    function removeModule(uint256 index) public {

        require(_admin.hasRole(6, msg.sender), 'sender is not eligible to remove modules');

        require(index < _modules.length);

        // replace selected module with last one
        _modules[index] = _modules[_modules.length - 1];

        // delete now duplicate last entry and shortens array
        _modules.length--;
    }*/

}
