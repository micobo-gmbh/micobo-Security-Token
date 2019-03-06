pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/access/Roles.sol';

contract PauserRole {
    using Roles for Roles.Role;

    event PauserAdded(address indexed account);
    event PauserRemoved(address indexed account);

    Roles.Role private _pausers;

    function isPauser(address account) public view returns (bool) {
        return _pausers.has(account);
    }

    // onlyPauser removed to be overwritten by onlyAdmin
    function addPauser(address account) public {
        _addPauser(account);
    }

    function renouncePauser() public {
        removePauser(msg.sender);
    }

    function _addPauser(address account) internal {
        _pausers.add(account);
        emit PauserAdded(account);
    }

    // this is made public for admin to access it
    function removePauser(address account) public {
        _pausers.remove(account);
        emit PauserRemoved(account);
    }
}

