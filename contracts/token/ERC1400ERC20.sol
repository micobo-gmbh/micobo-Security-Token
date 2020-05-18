pragma solidity 0.6.6;

import "./ERC1400Partition.sol";

import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IERC1400Raw.sol";


/**
 * @author openzeppelin
 * @title Capped token
 * @dev token with a total cap and partition specific caps.
 * Cap cannot be changed afterwards.
 */
contract ERC1400ERC20 is ERC1400Partition, IERC20 {

    constructor(
        string memory name,
        string memory symbol,
        uint256 granularity
    )
    public
    ERC1400Partition(name, symbol, granularity){}

    // Mapping from (tokenHolder, spender) to allowed value.
    mapping(address => mapping(address => uint256)) internal _allowed;

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address who) public override view returns (uint256) {
        return _balances[who];
    }

    function transfer(address to, uint256 value) external override returns (bool) {
        _transferByDefaultPartitions(_msgSender(), _msgSender(), to, value, '', '');
        return true;
    }

    function approve(address spender, uint256 value) external override returns (bool) {
        require(spender != address(0), "A5");
        // Transfer Blocked - Sender not eligible
        _allowed[_msgSender()][spender] = value;
        emit Approval(_msgSender(), spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external override returns (bool) {
        // check if is operator by partition or has enough allowance here
        require(value <= _allowed[from][_msgSender()], "A7");
        // Transfer Blocked - Identity restriction

        _allowed[from][_msgSender()] = _allowed[from][_msgSender()].sub(value);

        // transfer by partition
        _transferByDefaultPartitions(from, from, to, value, '', '');
        return true;
    }

    // Implemented in ERC1400Raw
    // function totalSupply() external view returns (uint256)
    // function balanceOf(address who) external view returns (uint256)

    function allowance(address owner, address spender) external override view returns (uint256) {
        return _allowed[owner][spender];
    }
}
