pragma solidity 0.6.6;

interface IConstraintsModule {

    // they should also implement an interface to the token they are referring to
    // to call functions like hasRole() from Administrable

    // string private _module_name;

    function isValid(
        address msg_sender,
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata operatorData
    )
    external
    view
    returns (
        bool valid,
        string memory message
    );

    function getModuleName() external view returns (string memory);
}
