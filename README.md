## micobo Security Token

### Components

There are 2 main components:

1. _Security Token Contract_  
2. _Admin Contract_

#
### Architecture

TODO
#
## Tests

All functionality of the smart contracts is tested in mulitple test classes found in the `/test` folder.  
The tests are kept completely as atomic (specific) and autonomous as possible.  
Autonomy means that no test will fail or succeed dependant on the outcome of a different test.

**To use truffle tests on your own testchain, change the** ``.mnemonic`` **file to containt your own mnemonic key!**  
Also make sure that your testnet is running on port ```:8545```

Use the test script to run all tests:
```
npm run test
```
#

#### Gas report

Gas report is configured by default in ``truffle-config.js``

#
## Deployment

Edit the ``token-config.json`` file to set token **name**, **symbol** and **cap** etc.

Use the deploy script to deploy all contracts on local testnet (localhost:8454):
```
npm run deploy
```
#
#### Administration Logic Contract

The Administration contract can endow addresses with one **Role** or more:

* 0 ADMIN   (can add and remove roles)
* 1 CONTROLLER (ERC1400, can move tokens if contract _isControllable),
* 2 MINTER / ISSUER,
* 3 PAUSER,
* 4 BURNER / REDEEMER
* 5 CAP_EDITOR
* 6 MODULE_EDITOR (can edit constraint modules),
* 7 DOCUMENT_EDITOR

#

#### Constrainable

Constraint Modules can be set to implement any kind of on-chain checks.

#
### Process Flows

TODO



#
## Gas Consumption

TODO

#  
#### Diagrams

All diagrams were made with the free software [draw.io](draw.io)  
Simply open the corresponding XML file in the editor and export into JPEG to update any diagram.




