/*
	Test constraint functionality
 */

const { deployAllContracts, Role } = require("./deployment.js");

const truffleAssert = require("truffle-assertions");

contract("Test Constraint Contract", async accounts => {
  let contracts;

  let moduleAddresses = ["0x024269E2057b904d1Fa6a7B52056A8580a85180F"];

  // deepEqual compares with '==='

  before(async () => {
    contracts = await deployAllContracts(accounts);

    // add constraintEditor
    await contracts.micoboSecurityToken.addRole(
      Role.CONSTRAINTS_EDITOR,
      accounts[0]
    );
  });

  it("can set modules", async () => {
    await truffleAssert.passes(
      contracts.micoboSecurityToken.setModules(moduleAddresses)
    );

    assert.deepEqual(
      await contracts.micoboSecurityToken.modules(),
      moduleAddresses
    );
  });

  // TODO test out some real modules and their effects
});
