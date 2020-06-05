pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/IRelayRecipient.sol";


/**
 * @author Simon Dosch
 * @title IGSNable
 * @dev GSNable interface
 */
interface IGSNable {
	/**
	 * @dev Emitted when a new GSN mode is set
	 */
	event GSNModeSet(gsnMode);

	/**
	 * @dev Emitted when a new GSN module address is set
	 */
	event GSNModuleSet(IRelayRecipient);

	/**
	 * @dev Enum describing the possible GSN modes
	 */
	enum gsnMode { ALL, MODULE, NONE }

	/**
	 * @dev Sets GSN mode to either ALL, NONE or MODULE
	 * @param mode ALL, NONE or MODULE
	 */
	function setGSNMode(gsnMode mode) external;

	/**
	 * @dev Gets GSN mode
	 * @return gsnMode ALL, NONE or MODULE
	 */
	function getGSNMode() external view returns (gsnMode);

	/**
	 * @dev Sets Module address for MODULE mode
	 * @param newGSNModule Address of new GSN module
	 */
	function setGSNModule(IRelayRecipient newGSNModule) external;

	/**
	 * @dev Upgrades the relay hub address
	 * @param newRelayHub Address of new relay hub
	 */
	function upgradeRelayHub(address newRelayHub) external;

	/**
	 * @dev Withdraws GSN deposits for this contract
	 * @param amount Amount to be withdrawn
	 * @param payee Address to sned the funds to
	 */
	function withdrawDeposits(uint256 amount, address payable payee) external;
}
