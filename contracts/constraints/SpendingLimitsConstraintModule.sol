pragma solidity 0.5.12;

/*
import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract SpendingLimitsConstraintModule is IConstraintsModule {

    // TODO

    ISecurityToken _securityToken;

    string private module_name;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value,
        string module_name
    );

    // module data

    mapping(bytes32 => mapping(uint256 => uint256) limitsByPartitionByTime;

    mapping(bytes32 => uint256) lockingPeriodByPartition;

    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
    }

    // function edit limits

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
    view
    returns (
        bool valid,
        string memory message
    )
    {

        // TODO check limits

        return (valid, message);
    }

}
*/