pragma solidity 0.5.0;

import './IConstraintsModule.sol';
import '../administration/Administrable.sol';

contract Constrainable is Administrable {

    IConstraintsModule[] private _modules;

    constructor(address[] memory controllers)
    public
    Administrable(controllers)
    {
        // init the modules array?
    }

    // ??? when data or operator data are left empty, how does OffChainValidator know which one it is supposed to check for the certificate
    // i guess we will just let it try both when in doubt
    // we need to keep this modifier open though, so the internal transfer functions can dynamically use this
    // even when some variables remain empty


    function validateTransaction(
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
                _msgSender(),
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

    /**
     * Adding a constraint module
     */
    function addModule(IConstraintsModule module) onlyRole(6) public {

        /**
         * @dev See if the new address is home to a contract
         * Credit:
         * https://github.com/Dexaran/ERC223-token-standard/blob/Recommended/ERC223_Token.sol#L107-L114
         */

        uint length;
        assembly {
        // get the code size of this address, if it has code it's a contract!
            length := extcodesize(module)
        }
        require(length > 0, 'no contract at this address');

        _modules.push(module);
    }

    /**
     * Removing a constraint module
     */
    function removeModule(uint256 index) onlyRole(6) public {

        if (index >= _modules.length) return;

        // replace selected module with last one
        _modules[index] = _modules[_modules.length - 1];

        // delete now duplicate last entry and shorten array
        _modules.length--;
    }
}
