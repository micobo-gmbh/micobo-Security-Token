pragma solidity 0.5.12;

import './Administrable.sol';
import "../interfaces/IConstraintsModule.sol";

contract Constrainable is Administrable {

    // Questions for OffChainValidator
    // ??? when data or operator data are left empty, how does OffChainValidator know which one it is supposed to check for the certificate
    // i guess we will just let it try both when in doubt
    // we need to keep this modifier open though, so the internal transfer functions can dynamically use this
    // even when some variables remain empty


    IConstraintsModule[] private _modules;

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
        require(hasRole(6, msg.sender), 'A7');
        _modules = newModules;
    }

}
