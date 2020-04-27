pragma solidity 0.6.6;

import "./ISecurityToken.sol";

/**
 * @title Interface for using the Security Token Partition
 * @dev this interface is meant solely for usage with libraries like truffle or web3.js.
 * it is not used by any deployed contract
 */

interface ISecurityTokenPartition {

    function securityTokenAddress() external view returns (ISecurityToken);

    function partitionId() external view returns (bytes32);

    function cap() external view returns (uint256);


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

    function granularity() external view returns (uint256);

    function transferWithData(address to, uint256 value, bytes calldata data) external;

    // this is where the operator functionality is used
    function transferFromWithData(
        address from,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata /*operatorData*/)
    external;


    // only REDEEMERS can redeem tokens

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
    function setGSNAllowed(bool allow) external;
    function getGSNAllowed() external view returns (bool);
}
