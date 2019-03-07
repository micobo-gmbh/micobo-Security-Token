pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/access/Roles.sol';

contract AdminRole {
    using Roles for Roles.Role;

    address public owner;

    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);

    Roles.Role private _admins;

    constructor (address admin) internal {
        _addAdmin(msg.sender);
        owner = msg.sender;
    }

    modifier _onlyAdmins() {
        require(isAdmin(msg.sender));
        _;
    }

    function isAdmin(address account) public view returns (bool) {
        return _admins.has(account);
    }

    function addAdmin(address account) public _onlyAdmins {
        _addAdmin(account);
    }

    function renounceAdmin() public {
        // can never delete owner admin account
        require(owner != msg.sender);
        _removeAdmin(msg.sender);
    }

    function _addAdmin(address account) internal {
        _admins.add(account);
        emit AdminAdded(account);
    }

    function _removeAdmin(address account) internal {
        _admins.remove(account);
        emit AdminRemoved(account);
    }
}
