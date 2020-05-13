pragma solidity 0.6.6;


import '../interfaces/IConstraintModule.sol';
import '../interfaces/ISecurityToken.sol';

contract PauseConstraintModule is IConstraintModule {

    ISecurityToken _securityToken;

    bytes32 private _module_name = keccak256('PAUSE');

    /**
    * @dev Emitted when the pause is triggered by a pauser (`account`).
    */
    event Paused(address account);


    /**
    * @dev Emitted when the pause is lifted by a pauser (`account`).
    */
    event Unpaused(address account);

    bool private _paused;


    constructor(
        address tokenAddress
    ) public {
        _securityToken = ISecurityToken(tokenAddress);
        _paused = false;
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
        if (_paused) {
            return (false, hex'A8', '', 'A8 - contract is paused');
        } else {
            return (true, code, extradata, '');
        }
    }



    // MODULE FUNCTIONS


    /**
    * @dev Returns true if the contract is paused, and false otherwise.
    */
    function paused() public view returns (bool) {
        return _paused;
    }


    /**
    * @dev Modifier to make a function callable only when the contract is not paused.
    */
    modifier whenNotPaused() {
        require(!_paused, 'contract is paused');
        _;
    }



    /**
    * @dev Modifier to make a function callable only when the contract is paused.
    */
    modifier whenPaused() {
        require(_paused, 'contract is not paused');
        _;
    }



    /**
    * @dev Called by a pauser to pause, triggers stopped state.
    */
    function pause() public whenNotPaused {
        require(_securityToken.hasRole(bytes32('PAUSER'), msg.sender), 'A7');
        _paused = true;
        emit Paused(msg.sender);
    }



    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public whenPaused {
        require(_securityToken.hasRole(bytes32('PAUSER'), msg.sender), 'A7');
        _paused = false;
        emit Unpaused(msg.sender);
    }


    // VIEW

    function getModuleName() public override view returns (bytes32) {
        return _module_name;
    }

}

