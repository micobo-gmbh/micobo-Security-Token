pragma solidity ^0.5.0;

import './ERC20Capped.sol';
import './Pausable.sol';

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
        ConstraintsInterface constraints,
        AdministrationInterface admin

    ) ERC20Capped(cap) public {

        _name = name;
        _symbol = symbol;
        _decimals = decimals;

        _constraints = constraints;
        _admin = admin;
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

        (bool success, string memory message) = _constraints.check(msg.sender, from, to, value);

        // check the constraints contract, if this transfer is valid
        require(success, message);

        // proceed to call the standard transfer function of our parent contract
        return super.transferFrom(from, to, value);
    }


    // MINTER

    modifier onlyMinter() {
        require(_admin.isMinter(msg.sender));
        _;
    }

    function mint(address to, uint256 value) onlyMinter public returns (bool) {
        super.mint(to, value);
    }


    // MINTER

    modifier onlyPauser() {
        require(_admin.isPauser(msg.sender));
        _;
    }

    function pause() public onlyPauser whenNotPaused {
        super.pause();
    }

    function unpause() public onlyPauser whenPaused {
        super.unpause();
    }

}

