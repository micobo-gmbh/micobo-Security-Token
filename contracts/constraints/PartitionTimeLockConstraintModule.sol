pragma solidity 0.5.12;


import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract TimeLockConstraintModule is IConstraintsModule {

    // TODO

    ISecurityToken _securityToken;

    string private _module_name = "TIME_LOCK";

    // module data
    mapping(bytes32 => uint256) private _partitionTimeLock;


    address _owner;

    constructor(
        address tokenAddress
    ) public {
        _owner = msg.sender;
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

    // VIEW

    function getModuleName() public view returns (string memory) {
        return _module_name;
    }
}