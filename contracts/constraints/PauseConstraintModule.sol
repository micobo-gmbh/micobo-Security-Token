pragma solidity 0.6.6;


import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";

contract PauseConstraintModule is IConstraintsModule {

    // TODO partition-ready

    ISecurityToken _securityToken;

    string public _module_name = "PAUSE";

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
        address tokenAddress
    ) public {
        _owner = msg.sender;
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
    override
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
        require(_securityToken.hasRole(bytes32("PAUSER"), msg.sender), 'A7');
        _paused = true;
        emit Paused(msg.sender);
    }



    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public whenPaused {
        require(_securityToken.hasRole(bytes32("PAUSER"), msg.sender), 'A7');
        _paused = false;
        emit Unpaused(msg.sender);
    }


    // VIEW

    function getModuleName() public override view returns (string memory) {
        return _module_name;
    }

}

