pragma solidity ^0.5.0;

/**
 * @title CompliantTokenInterface
 * @dev this interface is meant solely for usage with libraries like truffle or web3.js.
 * it is not used by any deployed contract
 */

interface CompliantTokenInterface {


    // ERC20Detailed

    /**
     * @return the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @return the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @return the number of decimals of the token.
     */
    function decimals() external view returns (uint8);



    //  ERC20  is IERC20

    /*  using SafeMath for uint256;

      mapping (address => uint256) private _balances;

      mapping (address => mapping (address => uint256)) private _allowed;

      uint256 private _totalSupply;
    */

    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);



    // Capped Minting


    /**
    uint256 private _cap;

    constructor (uint256 cap) public {
        require(cap > 0);
        _cap = cap;
    }

    /**
     * @return the cap for the token minting.

    function cap() public view returns (uint256) {
        return _cap;
    }
    */
    function cap() external view returns (uint256);

    /**
    function _mint(address account, uint256 value) internal {

        require(totalSupply().add(value) <= _cap);
        super._mint(account, value);
    }
    */

    /**
    modifier onlyMinter() {
        require(_admin.isMinter(msg.sender));
        _;
    }

    function mint(address to, uint256 value) onlyMinter public returns (bool) {
        super._mint(to, value);
    }
    */
    function mint(address to, uint256 value) external returns (bool);




    // Burnable

    /*
    function destroy(address target, uint256 amount) onlyBurner public {
        _burn(target, amount);
    }
    */
    function destroy(address target, uint256 amount)  external;




    // Pausable

    /*
    event Paused(address account);
    event Unpaused(address account);
    */

    /*
    bool private _paused;

    constructor () internal {
        _paused = false;
    }
    */

    /**
     * @return true if the contract is paused, false otherwise.

    function paused() public view returns (bool) {
        return _paused;
    }
    */
    function paused() external view returns (bool);

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.

    modifier whenNotPaused() {
        require(!_paused);
        _;
    }
    */

    /**
     * @dev Modifier to make a function callable only when the contract is paused.

    modifier whenPaused() {
        require(_paused);
        _;
    }
    */

    /**
     * @dev called by the owner to pause, triggers stopped state

    function pause() public whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }
    */

    /**
     * @dev called by the owner to unpause, returns to normal state

    function unpause() public whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
    */

    /**
    modifier onlyPauser() {
        require(_admin.isPauser(msg.sender));
        _;
    }
    */

    /**
    function pause() public onlyPauser whenNotPaused {
        super.pause();
    }
    */
    function pause() external;

    /**
    function unpause() public onlyPauser whenPaused {
        super.unpause();
    }
    */
    function unpause() external;



}

