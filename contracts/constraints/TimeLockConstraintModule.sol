pragma solidity 0.6.6;

import '../interfaces/IConstraintModule.sol';
import '../interfaces/ISecurityToken.sol';

contract TimeLockConstraintModule is IConstraintModule {

    ISecurityToken _securityToken;

    bytes32 private _module_name = keccak256('TIME_LOCK');

    // module data
    mapping(address => uint256) private _accountTimeLock;

    uint256 _timeLock;


    constructor(
        address tokenAddress
    ) public {
        _securityToken = ISecurityToken(tokenAddress);
    }

    // function to edit limits
    function editAccountTimeLock(address account, uint256 time) public {
        require(_securityToken.hasRole(bytes32('TIME_LOCK_EDITOR'), msg.sender), 'A7');
        _accountTimeLock[account] = time;
    }

    function editTimeLock(uint256 time) public {
        require(_securityToken.hasRole(bytes32('TIME_LOCK_EDITOR'), msg.sender), 'A7');
        _timeLock = time;
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
        address msg_sender,
        bytes32 /* partition */,
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
        if(_timeLock > now ) {
             return(false, hex'A8', '', 'A8 - partition is still locked');
        } else if(_accountTimeLock[msg_sender] > now) {
            return(false, hex'A8', '', 'A8 - account is still locked');
        } else {
            return(true, code, extradata, '');
        }
    }

    // VIEW

    function getModuleName() public override view returns (bytes32) {
        return _module_name;
    }
}