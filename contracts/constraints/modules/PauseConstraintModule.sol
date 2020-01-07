pragma solidity ^0.5.0;

import "../IConstraintsModule.sol";
import "../../ISecurityToken.sol";

contract OffChainValidator is IConstraintsModule {

    // TODO

    string private module_name;

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

    ISecurityToken _token;

    constructor(
        address owner,
        ISecurityToken tokenAddress
    ) public {
        _owner = owner;
        _token = tokenAddress;
        _paused = false;
    }

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

        require(!_paused);

        return (valid, message);
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
        require(_token.hasRole(3, msg.sender));
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public whenPaused {
        require(_token.hasRole(3, msg.sender));
        _paused = false;
        emit Unpaused(msg.sender);
    }

}
