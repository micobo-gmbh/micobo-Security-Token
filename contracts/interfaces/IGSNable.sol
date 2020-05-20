pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/IRelayRecipient.sol";


interface IGSNable {
	event GSNModeSet(gsnMode);

	event GSNModuleSet(IRelayRecipient);

	enum gsnMode { ALL, MODULE, NONE }

	function setGSNMode(gsnMode m) external;

	function getGSNMode() external view returns (gsnMode);

	function setGSNModule(IRelayRecipient newGSNModule) external;

	function upgradeRelayHub(address newRelayHub) external;

	function withdrawDeposits(uint256 amount, address payable payee) external;
}
