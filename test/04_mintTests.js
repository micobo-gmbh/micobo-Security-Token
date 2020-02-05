const { deployAllContracts, Role } = require("./deployment.js");

const truffleAssert = require("truffle-assertions");

const conf = require("../token-config");

contract("Test Minting", async accounts => {

  let contracts;

  let minter = accounts[1];

  let value = 1234567890;

  // deepEqual compares with '==='

  before(async () => {
    contracts = await deployAllContracts(accounts);
  });

  it("mints tokens to test addresses if minter", async () => {
    await truffleAssert.fails(
      contracts.micoboSecurityToken.issueByPartition(
        conf.standardPartition,
        accounts[0],
        value,
        "0x0"
      )
    );

    await contracts.micoboSecurityToken.addRole(Role.MINTER, accounts[0]);

    await contracts.micoboSecurityToken.issueByPartition(
      conf.standardPartition,
      accounts[0],
      value,
      "0x0"
    );

    let balance = (
      await contracts.micoboSecurityToken.balanceOfByPartition(
        conf.standardPartition,
        accounts[0]
      )
    ).toNumber();

    // console.log("balance: ", balance);

    assert.deepEqual(balance, value);
  });

  it("cannot mint more than cap", async () => {
    await truffleAssert.fails(
      contracts.micoboSecurityToken.issueByPartition(
        conf.standardPartition,
        accounts[0],
        conf.standardPartitionCap + 1,
        "0x0"
      )
    );
  });
});
