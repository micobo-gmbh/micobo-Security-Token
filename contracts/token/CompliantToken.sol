pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

import "../constraints/ConstraintsInterface.sol";
import "../administration/AdministrationInterface.sol";



// AosToken implements the ERC20 token standard

contract CompliantToken is ERC20Capped, Pausable {

    /**
     * @dev The Constraints Master Contract
     */
    ConstraintsInterface public _constraints;

    /**
     * @dev The Administration Master Contract
     */
    AdministrationInterface public _admin;

    // ERC20Detailed

    string private _name;
    string private _symbol;
    uint8 private _decimals;



    // we hand over the _cap to ERC20Capped's constructor

    constructor (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint cap,
        ConstraintsInterface constraints
    
    ) ERC20Capped(cap) public {

        _name = name;
        _symbol = symbol;
        _decimals = decimals;

        _constraints = constraints;
    }

    /**
     * @return the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }


    // override critical functions with "whenNotPaused" and "check()"

    function transfer(address to, uint256 value) whenNotPaused public returns (bool) {

        (bool success, string memory message) = _constraints.check(msg.sender, msg.sender, to, value);

        // check the constraints contract, if this transfer is valid
        require(success, message);

        // proceed to call the standard transfer function of our parent contract
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) whenNotPaused public returns (bool) {

        (bool success, string memory message) = _constraints.check(msg.sender, msg.sender, to, value);

        // check the constraints contract, if this transfer is valid
        require(success, message);

        // proceed to call the standard transfer function of our parent contract
        return super.transferFrom(from, to, value);
    }
}

