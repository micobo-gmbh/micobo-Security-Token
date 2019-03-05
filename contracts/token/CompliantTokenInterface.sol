pragma solidity ^0.5.0;

/**
 * @title AOS-Token-ConstraintsInterface
 */

interface CompliantTokenInterface {

    function name() external view returns (string memory);

    /**
     * @return the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @return the number of decimals of the token.
     */
    function decimals() external view returns (uint8);



    // ERC20Capped    is ERC20Mintable
    /**
        uint256 private _cap;

        constructor (uint256 cap) public {
            require(cap > 0);
            _cap = cap;
        }
    */
    /**
     * @return the cap for the token minting.
     */
    /*
    function cap() public view returns (uint256) {
        return _cap;
    }
    */
    function cap() external view returns (uint256);

    /**
     * @dev this calls the inherited _mint function of ERC20Mintable

    //        function _mint(address account, uint256 value) internal {
    //            require(totalSupply().add(value) <= _cap);
    //            super._mint(account, value);
    //        }
    */


    // ERC20Mintable    is ERC20, MinterRole

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.

            function mint(address to, uint256 value) public onlyMinter returns (bool) {
                _mint(to, value);
                return true;
            }
    */
    function mint(address to, uint256 value) external returns (bool);



    //  ERC20    is IERC20

    /*  using SafeMath for uint256;

      mapping (address => uint256) private _balances;

      mapping (address => mapping (address => uint256)) private _allowed;

      uint256 private _totalSupply;*/

    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);



    // MinterRole

    /*        using Roles for Roles.Role;

            event MinterAdded(address indexed account);
            event MinterRemoved(address indexed account);

            Roles.Role private _minters;

            constructor () internal {
                _addMinter(msg.sender);
            }

            modifier onlyMinter() {
                require(isMinter(msg.sender));
                _;
            }

            function isMinter(address account) public view returns (bool) {
                return _minters.has(account);
            }*/

    function isMinter(address account) external view returns (bool);

    /*         function addMinter(address account) public onlyMinter {
                _addMinter(account);
            }
    */
    function addMinter(address account) external;

    /*         function renounceMinter() public {
                _removeMinter(msg.sender);
            }
    */
    function renounceMinter() external;

    /*        function _addMinter(address account) internal {
                _minters.add(account);
                emit MinterAdded(account);
            }

            function _removeMinter(address account) internal {
                _minters.remove(account);
                emit MinterRemoved(account);
            }
    */



    // Roles

    /**
        struct Role {
            mapping (address => bool) bearer;
        }
    */



    // Pausable

    /*
        event Paused(address account);
        event Unpaused(address account);

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

    //        modifier whenNotPaused() {
    //            require(!_paused);
    //            _;
    //        }
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

            function pause() public onlyPauser whenNotPaused {
                _paused = true;
                emit Paused(msg.sender);
            }
    */
    function pause() external;

    /*
     * @dev called by the owner to unpause, returns to normal state

            function unpause() public onlyPauser whenPaused {
                _paused = false;
                emit Unpaused(msg.sender);
            }
    */
    function unpause() external;


    // PauserRole

    /*        using Roles for Roles.Role;

            event PauserAdded(address indexed account);
            event PauserRemoved(address indexed account);

            Roles.Role private _pausers;

            constructor () internal {
                _addPauser(msg.sender);
            }

            modifier onlyPauser() {
                require(isPauser(msg.sender));
                _;
            }
    */

    /*        function isPauser(address account) public view returns (bool) {
                return _pausers.has(account);
            }
    */
    function isPauser(address account) external view returns (bool);

    /*        function addPauser(address account) public onlyPauser {
                _addPauser(account);
            }
    */
    function addPauser(address account) external;

    /*        function renouncePauser() public {
                _removePauser(msg.sender);
            }
    */
    function renouncePauser() external;

    /*         function _addPauser(address account) internal {
                _pausers.add(account);
                emit PauserAdded(account);
            }

            function _removePauser(address account) internal {
                _pausers.remove(account);
                emit PauserRemoved(account);
            }
    */

}

