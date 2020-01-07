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

    modifier isValidTransaction(
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    ) {
        callConstraintModules(
            partition,
            operator,
            from,
            to,
            value,
            data,
            operatorData
        );
        _;
    }

    function callConstraintModules(
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
     * @dev we are not going to have too many entries in this array,
     * so simply replacing the whole thing is easier than deleting from an array
     * only ADMIN
     // TODO acutally let's implement a delete function like in ERC1400Partition
     */
    function addModule(IConstraintsModule module) onlyRole(0) public {

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
}
