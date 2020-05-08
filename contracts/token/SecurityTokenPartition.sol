pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/ISecurityToken.sol";
import "../gsn/GSNable.sol";

contract SecurityTokenPartition is IERC20, GSNable {

    using SafeMath for uint256;

    ISecurityToken internal _securityToken;

    bytes32 internal _partitionId;


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

    function name() external view returns (string memory) {
        return _securityToken.name();
    }

    function symbol() external view returns (string memory) {
        return _securityToken.symbol();
    }

    function decimals() external pure returns (uint8) {
        return uint8(18);
    }

    //******************/
    // ERC20
    //******************/

    // Mapping from (tokenHolder, spender) to allowed value.
    mapping(address => mapping(address => uint256)) internal _allowed;

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
        require(value <= _allowed[from][_msgSender()], "A7");
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

    function totalSupply() external override(IERC20) view returns (uint256) {
        return _securityToken.totalSupplyByPartition(_partitionId);
    }

    function balanceOf(address who) external override(IERC20) view returns (uint256) {
        return _securityToken.balanceOfByPartition(_partitionId, who);
    }

    function allowance(address owner, address spender) external override view returns (uint256) {
        return _allowed[owner][spender];
    }

    // GSN
    function isGSNController() internal view override returns (bool) {
        return _securityToken.hasRole(bytes32("GSN_CONTROLLER"), _msgSender());
    }
}



