pragma solidity 0.6.6;

import '../interfaces/IConstraintModule.sol';
import '../interfaces/ISecurityToken.sol';

contract TimeLockConstraintModule is IConstraintModule {

    ISecurityToken _securityToken;

    bytes32 private _module_name = keccak256('TIME_LOCK');

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
        require(_securityToken.hasRole(bytes32('TIME_LOCK_EDITOR'), msg.sender), 'A7');
        _partitionTimeLock[partition] = time;
    }

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
    override
    returns (bool, string memory) {
        (bool valid, , , string memory reason) = validateTransfer(
            msg_sender,
            partition,
            operator,
            from,
            to,
            value,
            data,
            operatorData
        );

        return (valid, reason);
    }

    function validateTransfer(
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
    view
    override
    returns (
        bool valid,
        byte code,
        bytes32 extradata,
        string memory reason
    )
    {
        if(_partitionTimeLock[partition] > now) {
            return(false, hex'A8', '', 'A8 - partition is still locked');
        } else {
            return(true, code, extradata, '');
        }
    }

    // VIEW

    function getModuleName() public override view returns (bytes32) {
        return _module_name;
    }
}