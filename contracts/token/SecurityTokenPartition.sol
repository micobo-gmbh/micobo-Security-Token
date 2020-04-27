pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/ISecurityToken.sol";
import "../interfaces/IERC1400Raw.sol";
import "../gsn/GSNable.sol";

contract SecurityTokenPartition is IERC20, IERC1400Raw, GSNable {

    using SafeMath for uint256;

    ISecurityToken internal _securityToken;

    bytes32 internal _partitionId;

    // Mapping from (tokenHolder, spender) to allowed value.
    mapping(address => mapping(address => uint256)) internal _allowed;


    constructor(address securityTokenAddress, bytes32 partition) public {

        // TODO maybe set interface implementation 1820 for ERC20 here?

        _securityToken = ISecurityToken(securityTokenAddress);
        _partitionId = partition;
    }

    function securityTokenAddress() external view returns (ISecurityToken) {
        return _securityToken;
    }

    function partitionId() external view returns (bytes32) {
        return _partitionId;
    }

    function cap() external view returns (uint256) {
        return _securityToken.capByPartition(_partitionId);
    }


    //******************/
    // ERC20Detailed
    //******************/

    function name() external override view returns (string memory) {
        return _securityToken.name();
    }

    function symbol() external override view returns (string memory) {
        return _securityToken.symbol();
    }

    function decimals() external pure returns (uint8) {
        return uint8(18);
    }

    //******************/
    // ERC20
    //******************/

    function transfer(address to, uint256 value) external override returns (bool) {

        // transferByPartition contains "_msgSender()", which would be THIS contract's address
        // this is why this contract is a controllerByPartition so we can still make transfers.
        _securityToken.operatorTransferByPartition(_partitionId, _msgSender(), to, value, '', '');
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
        require(_securityToken.isOperatorForPartition(_partitionId, _msgSender(), from) ||
        (value <= _allowed[from][_msgSender()]), "A7");
        // Transfer Blocked - Identity restriction

        if (_allowed[from][_msgSender()] >= value) {
            _allowed[from][_msgSender()] = _allowed[from][_msgSender()].sub(value);
        } else {
            _allowed[from][_msgSender()] = 0;
        }

        // transfer by partition
        _securityToken.operatorTransferByPartition(_partitionId, from, to, value, '', '');
        return true;
    }

    function totalSupply() external override(IERC20, IERC1400Raw) view returns (uint256) {
        return _securityToken.totalSupplyByPartition(_partitionId);
    }

    function balanceOf(address who) external override(IERC20, IERC1400Raw) view returns (uint256) {
        return _securityToken.balanceOfByPartition(_partitionId, who);
    }

    function allowance(address owner, address spender) external override view returns (uint256) {
        return _allowed[owner][spender];
    }


    //******************/
    // ERC1400Raw
    //******************/

    // ERC20Detailed  function name() external view returns (string memory); // 1/13
    // ERC20Detailed  function symbol() external view returns (string memory); // 2/13
    // ERC20  function totalSupply() external view returns (uint256); // 3/13
    // ERC20  function balanceOf(address owner) external view returns (uint256); // 4/13

    function granularity() external override view returns (uint256) {
        return _securityToken.granularity();
    }

    function transferWithData(address to, uint256 value, bytes calldata data)
    external
    {
        _securityToken.operatorTransferByPartition(_partitionId, _msgSender(), to, value, data, '');
    }

    // this is where the operator functionality is used
    function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata /*operatorData*/)
    external
    {
        // check if is operator by partition or has enough allowance here
        require(_securityToken.isOperatorForPartition(_partitionId, _msgSender(), from) ||
        (value <= _allowed[from][_msgSender()]), "A7");
        // Transfer Blocked - Identity restriction

        if (_allowed[from][_msgSender()] >= value) {
            _allowed[from][_msgSender()] = _allowed[from][_msgSender()].sub(value);
        } else {
            _allowed[from][_msgSender()] = 0;
        }

        // transfer by partition with data
        _securityToken.operatorTransferByPartition(_partitionId, from, to, value, data, '');
    }

    // only REDEEMERS can redeem tokens

    event TransferWithData(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data,
        bytes operatorData
    );

    // GSN
    function isGSNController() internal view override returns (bool) {
        return _securityToken.hasRole(bytes32("GSN_CONTROLLER"), _msgSender());
    }
}



