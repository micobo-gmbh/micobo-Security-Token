pragma solidity 0.5.0;


import "@openzeppelin/contracts/GSN/GSNRecipient.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ISecurityToken.sol";
import "./tokens/IERC1400Raw.sol";

contract SecurityTokenERC20Partition is IERC20, IERC1400Raw, GSNRecipient {

    ISecurityToken _securityToken;

    bytes32 _partitionId;

    // Mapping from (tokenHolder, spender) to allowed value.
    mapping(address => mapping(address => uint256)) internal _allowed;


    constructor(ISecurityToken securityTokenAddress, bytes32 partitionId) public {

        _securityToken = securityTokenAddress;
        _partitionId = partitionId;
    }


    //******************/
    // ERC20Detailed
    //******************/

    function name() external view returns (string memory) {
        return _securityToken.name();
    }

    function symbol() external view returns (string memory) {
        return _securityToken.symbol();
    }

    function decimals() external view returns (uint8) {
        return _securityToken.decimals();
    }

    //******************/
    // IERC20
    //******************/

    function transfer(address to, uint256 value) external returns (bool) {
        _securityToken.transferByPartition(_partitionId, to, value, '');
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(spender != address(0), "A5");
        // Transfer Blocked - Sender not eligible
        _allowed[_msgSender()][spender] = value;
        emit Approval(_msgSender(), spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        // check if is operator by partition or has enough allowance here
        require(_securityToken._isOperatorForPartition(_partitionId, _msgSender(), from)
            || (value <= _allowed[from][_msgSender()]), "A7");
        // Transfer Blocked - Identity restriction

        if (_allowed[from][_msgSender()] >= value) {
            _allowed[from][_msgSender()] = _allowed[from][_msgSender()].sub(value);
        } else {
            _allowed[from][_msgSender()] = 0;
        }

        // transfer by partition
        _securityToken.transferByPartition(_partitionId, to, value, '');
        return true;
    }

    function totalSupply() external view returns (uint256) {
        return _securityToken.totalSupplyByPartition(_partitionId);
    }

    function balanceOf(address who) external view returns (uint256) {
        return _securityToken.balanceOfByPartition(_partitionId, who);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowed[owner][spender];
    }


    // Transfer events are implemented in ERC1400ERC20
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);


    //******************/
    // ERC1400Raw
    //******************/

    // ERC20Detailed  function name() external view returns (string memory); // 1/13
    // ERC20Detailed  function symbol() external view returns (string memory); // 2/13
    // ERC20  function totalSupply() external view returns (uint256); // 3/13
    // ERC20  function balanceOf(address owner) external view returns (uint256); // 4/13

    function granularity() external view returns (uint256) {
        return _securityToken.granularity;
    }

    function controllers() external view returns (address[] memory) {
        return _securityToken.controllersByPartition(_partitionId);
    }

    function authorizeOperator(address operator) external {
        _securityToken.authorizeOperatorByPartition(_partitionId, operator);
    }

    function revokeOperator(address operator) external {
        _securityToken.revokeOperatorByPartition(_partitionId, operator);
    }

    function isOperator(address operator, address tokenHolder) external view returns (bool) {
        return _securityToken.isOperatorForPartition(_partitionId, operator, tokenHolder);
    }

    function transferWithData(address to, uint256 value, bytes calldata data)
    external
    {
        _securityToken.transferByPartition(_partitionId, to, value, data);
    }

    // this is where the operator functionality is used
    function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData)
    external
    {
        // check if is operator by partition or has enough allowance here
        require(_securityToken._isOperatorForPartition(_partitionId, _msgSender(), from)
            || (value <= _allowed[from][_msgSender()]), "A7");
        // Transfer Blocked - Identity restriction

        if (_allowed[from][_msgSender()] >= value) {
            _allowed[from][_msgSender()] = _allowed[from][_msgSender()].sub(value);
        } else {
            _allowed[from][_msgSender()] = 0;
        }

        // transfer by partition with data
        _securityToken.transferByPartition(_partitionId, to, value, data);
    }

    function redeem(uint256 value, bytes calldata data) external {
        _securityToken.redeemByPartition(_partitionId, value, data);
    }

    function redeemFrom(address from, uint256 value, bytes calldata data, bytes calldata operatorData) external {
        _securityToken.operatorRedeemByPartition(_partitionId, from, value, data, '');
    }

    event TransferWithData(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data,
        bytes operatorData
    );

    event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData);
    event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);
}



