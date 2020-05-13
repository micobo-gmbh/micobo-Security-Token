
pragma solidity 0.6.6;

/**
 * @title ERC1400 security token standard
 * @dev ERC1400 logic
 */
interface IERC1400Capped  {

    // Capped
    function cap() external view returns (uint256);
    function setCap(uint256 newCap) external;
}
