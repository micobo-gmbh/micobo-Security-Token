const PartitionTimeLockConstraintModule = artifacts.require(
	'PartitionTimeLockConstraintModule'
)

const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

const { deployAllContracts, Role, Code } = require('./deployment.js')

contract('Test Partition TimeLocks', async accounts => {

    let contracts, partitionTimeLockConstraintModule
    
    let value = 1000

	// deepEqual compares with '==='

	before(async () => {
		contracts = await deployAllContracts(accounts)

		// make me minter
		await contracts.micoboSecurityToken.addRole(Role.MINTER, accounts[0])

		// mint some new tokens to test with
		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[0],
			value,
			'0x0'
		)

		await contracts.micoboSecurityToken.issueByPartition(
			conf.standardPartition,
			accounts[1],
			value,
			'0x0'
		)
	})

	it('deploy PartitionTimeLockConstraintModule', async () => {
		partitionTimeLockConstraintModule = await PartitionTimeLockConstraintModule.new(
			contracts.micoboSecurityToken.address,
			'Partition Time Lock Module'
		)
	})

	it('register PartitionTimeLockConstraintModule', async () => {
		// adding CONSTRAINTS_EDITOR
		await contracts.micoboSecurityToken.addRole(
			Role.CONSTRAINTS_EDITOR,
			accounts[0]
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModules([
				partitionTimeLockConstraintModule.address
			])
		)
	})

	it('can edit timelock when time_lock_editor', async () => {
		await truffleAssert.fails(
			partitionTimeLockConstraintModule.editTimeLock(
				conf.standardPartition,
				1893456000
			) // 01/01/2030 @ 12:00 (UTC)
        )
        
        await contracts.micoboSecurityToken.addRole(Role.TIME_LOCK_EDITOR, accounts[0])

        await truffleAssert.passes(
			partitionTimeLockConstraintModule.editTimeLock(
				conf.standardPartition,
				1893456000
			) // 01/01/2030 @ 12:00 (UTC)
        )
	})

	it('cannot transfer when timelocked', async () => {
		partitionTimeLockConstraintModule.editTimeLock(
			conf.standardPartition,
			1893456000
		) // 01/01/2030 @ 12:00 (UTC)

		await truffleAssert.fails(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)
	})

	it('can transfer when timelock over', async () => {
		await partitionTimeLockConstraintModule.editTimeLock(
			conf.standardPartition,
			1577836800
        ) // 01/01/2020 @ 12:00 (UTC)
        
        // check if balance is enough
        assert.deepEqual(
			(await contracts.micoboSecurityToken.balanceOfByPartition(
				conf.standardPartition,
				accounts[0]
			)).toNumber(),
			value
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.transferByPartition(
				conf.standardPartition,
				accounts[1],
				value,
				'0x0',
				{ from: accounts[0] }
			)
		)
	})
})
