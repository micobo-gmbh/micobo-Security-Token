pragma solidity 0.5.12;


import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";

contract PauseConstraintModule is IConstraintsModule {

    ISecurityToken _securityToken;

    string public module_name;

    event Authorised(
        address msg_sender,
        address from,
        address to,
        uint256 value,
        string module_name
    );

    /**
    * @dev Emitted when the pause is triggered by a pauser (`account`).
    */
    event Paused(address account);


    /**
    * @dev Emitted when the pause is lifted by a pauser (`account`).
    */
    event Unpaused(address account);

    bool private _paused;


    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
        _paused = false;
    }

    function isValid(
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
    returns (
        bool,
        string memory
    )
    {
        if (_paused) {
            return (false, 'A8 - contract is paused');
        } else {
            return (true, '');
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
        require(_securityToken.hasRole(3, msg.sender));
        _paused = true;
        emit Paused(msg.sender);
    }


    
    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public whenPaused {
        require(_securityToken.hasRole(3, msg.sender));
        _paused = false;
        emit Unpaused(msg.sender);
    }

}

