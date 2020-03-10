pragma solidity 0.5.12;


import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract PartitionTimeLockConstraintModule is IConstraintsModule {

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
    mapping(bytes32 => uint256) private _partitionTimeLock;


    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
    }

    // function to edit limits
    function editTimeLock(bytes32 partition, uint256 time) public {
        require(_securityToken.hasRole(9, msg.sender), 'A7');
        _partitionTimeLock[partition] = time;
    }

    function isValid(
        address /* msg_sender */,
        bytes32 partition,
        address /* operator */,
        address /* from */,
        address /* to */,
        uint256 /* value */,
        bytes memory /* data */,
        bytes memory /* operatorData */
    )
    public
    returns (
        bool,
        string memory
    )
    {
        if(_partitionTimeLock[partition] > now) {
            return(false, 'A8 - partition is still locked');
        } else {
            return(true, '');
        }
    }
}