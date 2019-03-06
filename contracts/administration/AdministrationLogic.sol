pragma solidity ^0.5.0;

import './roles/AdminRole.sol';
import './roles/MinterRole.sol';
import "./roles/PauserRole.sol";


contract AdministrationLogic is AdminRole, MinterRole, PauserRole {

    // this needs to match the proxy's storage order
    address public administrationLogic;


    // override minter functions to enforce admin rights
    function addMinter(address account) _onlyAdmins public {
        super.addMinter(account);
    }

    function removeMinter(address account) _onlyAdmins public {
        super.removeMinter(account);
    }


    // do this for every role added
    function addPauser(address account) _onlyAdmins public {
        super.addPauser(account);
    }

    function removePauser(address account) _onlyAdmins public {
        super.removePauser(account);
    }
}