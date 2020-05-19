pragma solidity 0.6.6;


/**
 * @title IERC1400Raw token standard
 * @dev ERC1400Raw interface
 */
interface IERC1400Raw {

  function name() external view returns (string memory); // 1/13
  function symbol() external view returns (string memory); // 2/13

  // implemented in ERC20
  // function totalSupply() external view returns (uint256); // 3/13
  // function balanceOf(address owner) external view returns (uint256); // 4/13

  function granularity() external view returns (uint256); // 5/13

  // deleted (TODO add again in administrable)
  // function controllers() external view returns (address[] memory); // 6/13

  // not necessary for ERC1400Partition
  function authorizeOperator(address operator) external; // 7/13
  function revokeOperator(address operator) external; // 8/13
  function isOperator(address operator, address tokenHolder) external view returns (bool); // 9/13

  // not necessary for ERC1400Partition
  function transferWithData(address to, uint256 value, bytes calldata data) external; // 10/13
  function transferFromWithData(address from, address to, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 11/13

  // not possible with ERC1400Partition
  // function redeem(uint256 value, bytes calldata data) external; // 12/13
  // function redeemFrom(address from, uint256 value, bytes calldata data, bytes calldata operatorData) external; // 13/13

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
