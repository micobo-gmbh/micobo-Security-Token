pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/access/Roles.sol';

contract MinterRole {
    using Roles for Roles.Role;

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    Roles.Role private _minters;

    function isMinter(address account) public view returns (bool) {
        return _minters.has(account);
    }

    function addMinter(address account) public {
        _addMinter(account);
    }

    function renounceMinter() public {
        removeMinter(msg.sender);
    }

    function _addMinter(address account) internal {
        _minters.add(account);
        emit MinterAdded(account);
    }

    function removeMinter(address account) public {
        _minters.remove(account);
        emit MinterRemoved(account);
    }
}
