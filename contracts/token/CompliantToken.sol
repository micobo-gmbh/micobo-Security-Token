pragma solidity 0.5.0;

import './ERC20Capped.sol';
import './Pausable.sol';

import "../constraints/ConstraintsInterface.sol";
import "../administration/AdministrationInterface.sol";

/**
 * @author Simon Dosch
 * @title The main token contract
 */
contract CompliantToken is ERC20Capped, Pausable {

    /**
     * @dev The Constraints Master Contract
     */
    ConstraintsInterface public _constraints;

    /**
     * @dev The Administration Master Contract
     */
    AdministrationInterface public _admin;


    /**
     * ERC20Detailed
     *
     * The following section implements the ERC20Detailed contract from openzeppelin
     */

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Emitted whenever the mint function is successfully called
     */
    event Minted(
        address indexed msg_sender,
        address indexed to,
        uint value
    );

    /**
     * @param name name of the token
     * @param symbol token symbol
     * @param decimals token decimals
     * @param cap token cap
     * @param constraints contract address
     * @param admin contract address
     * @dev Sets the values for `name`, `symbol`, `decimals`, 'cap', 'constraints' and 'admin'.
     * All 6 of these values are immutable: they can only be set once during construction.
     *
     * we hand over the value of 'cap' to ERC20Capped constructor
     */
    constructor (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint cap,
        ConstraintsInterface constraints,
        AdministrationInterface admin
    )
        ERC20Capped(cap)
        public
    {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;

        _constraints = constraints;
        _admin = admin;
    }

    /**
     * @dev Modifier to make a function callable only when the calles is a PAUSER
     */
    modifier onlyPauser() {
        require(_admin.isPauser(msg.sender), 'only PAUSER allowed');
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the calles is a MINTER
     */
    modifier onlyMinter() {
        require(_admin.isMinter(msg.sender), 'only MINTER allowed');
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the calles is a BURNER
     */
    modifier onlyBurner() {
        require(_admin.isBurner(msg.sender), 'only BURNER allowed');
        _;
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


    /**
     * @param to the target address
     * @param value the amount to be transferred
     * @dev overriding the transfer function adding "whenNotPaused" and "check()"
     * @return true if the transfer succeeded
     */
    function transfer(address to, uint256 value)
        whenNotPaused
        public
        returns (bool)
    {
        (bool success, string memory message) = _constraints.check(msg.sender, msg.sender, to, value);

        // check the constraints contract, if this transfer is valid
        require(success, message);

        // proceed to call the standard transfer function of our parent contract
        return super.transfer(to, value);
    }

    /**
     * @param from the source address
     * @param to the target address
     * @param value the amount to be transferred
     * @dev overriding the transferFrom function adding "whenNotPaused" and "check()"
     * @return true if the transfer succeeded
     */
    function transferFrom(address from, address to, uint256 value)
        whenNotPaused
        public
        returns (bool)
    {
        (bool success, string memory message) = _constraints.check(msg.sender, from, to, value);

        // check the constraints contract, if this transfer is valid
        require(success, message);

        // proceed to call the standard transfer function of our parent contract
        return super.transferFrom(from, to, value);
    }

    /**
     * @param to the target address
     * @param value the amount to be minted
     * @dev Overrides mint function adding onlyMinter modifier
     *
     * See `ERC20._mint`.
     */
    function mint(address to, uint256 value) onlyMinter public {
        super._mint(to, value);
        emit Minted(msg.sender, to , value);
    }

    /**
     * @param target the address from which tokens are burned
     * @param amount the amount to be burned
     * @dev Exposes _burn function adding onlyBurner modifier
     *
     * it is called 'destroy' to signify its ability to burn tokens of any address!
     *
     * See `ERC20._burn`.
     */
    function destroy(address target, uint256 amount) onlyBurner public {
        _burn(target, amount);
    }

    /**
     * @dev Pauses the contract. Overrides pause function adding onlyPauser modifier
     * @notice If paused, functions 'transfer', 'transferFrom' and 'pause' can not be called
     */
    function pause() public onlyPauser whenNotPaused {
        super.pause();
    }

    /**
     * @dev Unpauses the contract. Overrides unpause function adding onlyPauser modifier.
     * @notice If not paused, functions 'transfer', 'transferFrom' and 'pause' can be called again
     */
    function unpause() public onlyPauser whenPaused {
        super.unpause();
    }

}

