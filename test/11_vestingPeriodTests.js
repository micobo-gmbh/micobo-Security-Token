const truffleAssert = require('truffle-assertions')

const conf = require('../token-config')

const VestingPeriodConstraintModule = artifacts.require(
	'VestingPeriodConstraintModule'
)

const {deployAllContracts, Role, Code} = require('./deployment.js');


contract('Test Vesting Period', async (accounts) => {

	let day = 86400

    let value = 1000

	let contracts

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

	it('deploy VestingPeriodConstraintModule', async () => {
		vestingPeriodConstraintModule = await VestingPeriodConstraintModule.new(
			contracts.micoboSecurityToken.address
		)
	})

	it('register VestingPeriodConstraintModule', async () => {
		// adding MODULE_EDITOR
		await contracts.micoboSecurityToken.addRole(
			Role.MODULE_EDITOR,
			accounts[0]
		)

		// can set module
		await truffleAssert.passes(
			contracts.micoboSecurityToken.setModules([
				vestingPeriodConstraintModule.address
			])
		)
	})

	it('can add vesting period when editor', async () => {
		assert.deepEqual(
			await contracts.micoboSecurityToken.hasRole(
			  Role.VESTING_PERIOD_EDITOR,
			  accounts[0]
			),
			false
		);
        
        let now = new Date().getTime()
        now = (now / 1000).toFixed(0)
        
        vestingStart = now - - 10

        console.log(now)
        console.log(vestingStart)

		// cannot set vesting options
        await truffleAssert.fails(
            vestingPeriodConstraintModule.setVestingOptionsByPartition(
                conf.standardPartition,
                vestingStart,
                4,
                48
            )
		)

		// add role
		await contracts.micoboSecurityToken.addRole(
			Role.VESTING_PERIOD_EDITOR,
			accounts[0]
		)

		// now it can set vesting options
		await truffleAssert.passes(
            vestingPeriodConstraintModule.setVestingOptionsByPartition(
                conf.standardPartition,
                vestingStart,
                4,
                48
            )
		)
    })
    
    it('cannot transfer before dormant period is over', async () => {
        // assumes that a vesting period has been set in the test case before this one

        // cannot transfer
        await truffleAssert.fails(
            contracts.micoboSecurityToken.transferByPartition(
                conf.standardPartition,
                accounts[1],
                1,
                '0x0',
                { from: accounts[0] }
            )
        )

        function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		await sleep(11000)
        
        console.log('waited for 11s')

        // can transfer again
        await truffleAssert.passes(
            contracts.micoboSecurityToken.transferByPartition(
                conf.standardPartition,
                accounts[1],
                1,
                '0x0',
                { from: accounts[0] }
            )
        ) 

	})
    
})