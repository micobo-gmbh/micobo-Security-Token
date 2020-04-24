pragma solidity 0.6.6;

import "../interfaces/IConstraintsModule.sol";
import "../interfaces/ISecurityToken.sol";


contract WhitelistConstraintModule is IConstraintsModule {

    ISecurityToken _securityToken;

    string private _module_name = "WHITELIST";

    // module data
    mapping(address => bool) private _whitelist;

    // TODO maybe change to canSend and can Receive

    address _owner;

    constructor(
        address tokenAddress
    ) public {
        _owner = msg.sender;
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
        require(accounts.length <= 40, 'too many accounts');

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
    public override
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

    // VIEW

    function getModuleName() public override view returns (string memory) {
        return _module_name;
    }
}
