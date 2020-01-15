let Migrations = artifacts.require('./Migrations.sol');

module.exports = async (deployer, network, accounts) => {

	console.log('Account to load with ETH: ', accounts[0]);
	await deployer.deploy(Migrations);
};
