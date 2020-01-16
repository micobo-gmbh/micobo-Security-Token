pragma solidity 0.5.9;

import "../../node_modules/@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "../../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAdmin.sol";


contract Administrable is GSNRecipient, ReentrancyGuard {

    IAdmin internal _admin;

    constructor (address adminContract) public {
        _admin = IAdmin(adminContract);
    }

    function admin() public view returns (IAdmin) {
        return _admin;
    }

}
