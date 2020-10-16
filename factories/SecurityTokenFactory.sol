pragma solidity >0.5.0;

import "../node_modules/@openzeppelin/upgrades/contracts/upgradeability/ProxyFactory.sol";
import "../node_modules/@openzeppelin/upgrades/contracts/ownership/Ownable.sol";


contract SecurityTokenFactory is ProxyFactory, OpenZeppelinUpgradesOwnable {
	address public implementationContract;

	constructor(address _implementationContract)
		public
		OpenZeppelinUpgradesOwnable()
	{
		implementationContract = _implementationContract;
	}

	function updateImplementation(address _implementationContract)
		public
		onlyOwner
	{
		implementationContract = _implementationContract;
	}

	function deployNewSecurityToken(
		uint256 _salt,
		address _admin,
		bytes memory _data
	) public returns (address proxy) {
		return deploy(_salt, implementationContract, _admin, _data);
	}
}
