pragma solidity 0.5.12;

import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract WhitelistConstraintModule is IConstraintsModule {

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
    mapping(address => bool) private _whitelist;

    // TODO maybe change to canSend and

    address _owner;

    constructor(
        address tokenAddress,
        string memory _module_name
    ) public {
        _owner = msg.sender;
        module_name = _module_name;
        _securityToken = ISecurityToken(tokenAddress);
    }

    function isWhitelisted(address account) public view returns (bool) {
        return _whitelist[account];
    }


    // function editWhitelist
    function editWhitelist(address account, bool whitelisted) public {
        require(_securityToken.hasRole(8, msg.sender), 'A8');
        _whitelist[account] = whitelisted;
    }

    // function bulkEditWhitelist
    function bulkEditWhitelist(address[] memory accounts, bool whitelisted) public {
        require(_securityToken.hasRole(8, msg.sender), 'A8');
        require(accounts.length <= 40);

        for(uint i = 0; i < accounts.length; i++) {
            _whitelist[accounts[i]] = whitelisted;
        }
    }


    function isValid(
        address /* msg_sender */,
        bytes32 /* partition */,
        address /* operator */,
        address from,
        address to,
        uint256 /* value */,
        bytes memory /* data */,
        bytes memory /* operatorData */
    )
    public
    view
    returns (
        bool valid,
        string memory message
    )
    {
        if(_whitelist[from] && _whitelist[to]) {
            return (true, '');
        } else if (!_whitelist[from]) {
            return (false, 'sender not whitelisted');
        } else {
            return (false, 'recipient not whitelisted');
        }
    }
}
