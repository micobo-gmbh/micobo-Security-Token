pragma solidity 0.6.6;

interface IConstraintModule {

    // ConstraintModule should also implement an interface to the token they are referring to
    // to call functions like hasRole() from Administrable

    // string private _module_name;

    function executeTransfer(
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
    returns (
        bool valid,
        string memory reason
    );

    function validateTransfer(
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
        byte code,
        bytes32 extradata,
        string memory reason
    );

    function getModuleName() external view returns (string memory);
}
