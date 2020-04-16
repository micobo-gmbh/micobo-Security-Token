pragma solidity 0.5.12;

contract IConstraintsModule {

    // they should also implement an interface to the token they are referring to
    // to call functions like hasRole() from Administrable

    string private _module_name;

    function isValid(
        address msg_sender,
        bytes32 partition,
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory operatorData
    )
    public
    returns (
        bool valid,
        string memory message
    );

    function getModuleName() external view returns (string memory);
}
