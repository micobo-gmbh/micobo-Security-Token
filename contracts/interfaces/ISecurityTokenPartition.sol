pragma solidity ^0.5.9;

import "./ISecurityToken.sol";

contract ISecurityTokenPartition {


    function securityTokenAddress() external returns (ISecurityToken);

    function partitionId() external returns (bytes32);


    //******************/
    // ERC20Detailed
    //******************/

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    //******************/
    // IERC20
    //******************/

    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);


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

    function granularity() external view returns (uint256);

    function controllers() external view returns (address[] memory);

    function authorizeOperator(address operator) external;

    function revokeOperator(address operator) external;

    function isOperator(address operator, address tokenHolder) external view returns (bool);

    function transferWithData(address to, uint256 value, bytes calldata data) external;

    // this is where the operator functionality is used
    function transferFromWithData(
        address from,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata /*operatorData*/)
    external;


    // only BURNERS can redeem tokens

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
    ) external view returns (uint256, bytes memory);
}
