pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/ISecurityToken.sol";
import "../interfaces/IERC1400Raw.sol";
import "../interfaces/ISecurityTokenPartition.sol";

contract SecurityTokenPartition is ISecurityTokenPartition, GSNRecipient {

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

    function securityTokenAddress() external override view returns (ISecurityToken) {
        return _securityToken;
    }

    function partitionId() external override view returns (bytes32) {
        return _partitionId;
    }

    function cap() external override view returns (uint256) {
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

    function decimals() external override view returns (uint8) {
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

    function totalSupply() external override view returns (uint256) {
        return _securityToken.totalSupplyByPartition(_partitionId);
    }

    function balanceOf(address who) external override view returns (uint256) {
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
    external override
    {
        _securityToken.operatorTransferByPartition(_partitionId, _msgSender(), to, value, data, '');
    }

    // this is where the operator functionality is used
    function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata /*operatorData*/)
    external override
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

    // only BURNERS can redeem tokens

    event TransferWithData(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data,
        bytes operatorData
    );


    // GSN

    function acceptRelayedCall(
        address /*relay*/,
        address /*from*/,
        bytes calldata /*encodedFunction*/,
        uint256 /*transactionFee*/,
        uint256 /*gasPrice*/,
        uint256 /*gasLimit*/,
        uint256 /*nonce*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxPossibleCharge*/
    ) external override view returns (uint256, bytes memory) {
        // TODO zero means accepting --> add some constraints
        return(0, "");
    }

    function _preRelayedCall(bytes memory /*context*/) internal override returns (bytes32) {
        return "";
    }

    function _postRelayedCall(
        bytes memory /*context*/,
        bool /*success*/,
        uint256 /*actualCharge*/,
        bytes32 /*preRetVal*/
    ) internal override {

    }
}



