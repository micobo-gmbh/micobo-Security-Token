pragma solidity 0.6.6;

import "../constraints/WhitelistConstraintModule.sol";
import "../interfaces/ISecurityToken.sol";

/*
Features:
    accept a predetermined amount of stablecoin as payment for 1 token
    check if user is whitelisted before allowing purchase
    check for predetermined purchase limit (per user)
    record purchases and accounts
    accept purchase entries from authorised address to account for off-chain fiat payments
    function that triggers distribution of tokens (as operator) to all accounts who made purchases
    callable only after a certain date
    purchases can be cancelled by issuer (in case of blacklisting or other events), refund will be taken care of off-chain
*/

// TODO activate full MetaTransactions
abstract contract ContextMixin {
    function msgSender() internal view returns (address payable sender) {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = msg.sender;
        }
        return sender;
    }
}

contract Sale is ContextMixin {
    address private _owner;

    ISecurityToken private _securityToken;
    WhitelistConstraintModule private _whitelist;

    mapping (address => uint256) private _purchases;
    mapping (address => uint256) private _limits;

    // address: address of the token contract managing the currency
    // uint256: rate, amount of tokens purchased per smallest unit of this currency
    // i.e. 1 USDC = 1 token --> rate = 10^6 (USDC has 6 decimals)
    mapping (address => uint256) private _accepted_curriencies;

    // maximum amount of tokens that can be sold
    uint256 private _cap;
    uint256 private _primary_market_end;

    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    constructor(
        address owner,
        address tokenAddress,
        address whitelistAddress,
        uint256 primary_market_end
    ) public {
        _owner = owner;
        _securityToken = ISecurityToken(tokenAddress);
        _whitelist = WhitelistConstraintModule(whitelistAddress);
        _primary_market_end = primary_market_end;
    }

    function addAcceptedCurrency(address tokenAddress, uint256 rate) public {
        // TODO
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == msgSender(), "Ownable: caller is not the owner");
        _;
    }
}