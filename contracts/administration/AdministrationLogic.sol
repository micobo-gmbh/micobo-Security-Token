pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/access/Roles.sol';
import './roles/AdminRole.sol';
import './roles/MinterRole.sol';


contract Administration is AdminRole, MinterRole {

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

}