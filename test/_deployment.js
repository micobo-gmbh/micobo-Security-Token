const Admin = artifacts.require('Admin')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const conf = require('../token-config');



deployAllContracts = async () => {

	let micoboSecurityToken, admin

	admin = await Admin.new(
		conf.admins,
		conf.controllers
	)

	micoboSecurityToken = await MicoboSecurityToken.new(
		conf.name,
		conf.symbol,
		conf.granularity,
		admin.address
	)

	return {
		micoboSecurityToken,
		admin
	}
}
