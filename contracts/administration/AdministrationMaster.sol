pragma solidity ^0.5.0;

/*
 * @author Simon Dosch
 * @title The proxy contract containing the _roles mapping and linking to the admin logic
 *
 * Security Note:
 *
 * It is highly recommended to use a multisig wallet for the ADMIN role
 * and to keep backups of the private keys used to control this wallet
 *
 * Keep in mind that:
 *
 * Anyone who controls the ADMIN role can grant access to any other role and thereby
 * gain access to every functions of the token including pausing, minting and burning!
 *
 * Anyone who controls the ADMIN_UPDATER role can potentially update the AdminLogic contract
 * in a way that he or she will
 * gain access to every functions of the token including pausing, minting and burning!
 */

contract AdministrationMaster {

    /**
     * @dev The Administration Logic Contract
     */
    address private administrationLogic;

    /**
     * @dev A mapping containing all relationships between roles and addresses
     */
    mapping(uint8 => mapping (address => bool)) _roles;

    /**
     * @param _impl the address of the admin logic contract, admin the address of the first ADMIN
     * @dev Sets the address for the administrationLogic contract as well as the first ADMIN
     * The administrationLogic address can be updated later on.
     * The ADMIN can only be deleted by another ADMIN.
     */
    constructor (address _impl, address admin) public {
        administrationLogic = _impl;

        // hard-coded ADMIN role 0
        _roles[0][admin] = true;
    }

    /**
     * @dev Returns the address of the contract currently set as the administrationLogic contract
     * @return the address of the contract currently set as the administrationLogic contract
     */
    function administrationLogicAddress() public view returns (address) {
        return administrationLogic;
    }

    /**
    * @dev See if the new address is home to a contract
    * Credit:
    * https://github.com/Dexaran/ERC223-token-standard/blob/Recommended/ERC223_Token.sol#L107-L114
    *
    * @param a Address of the new logic contract
    */
    modifier isContract (address a) {
        uint length;
        assembly {
        // get the code size of this address, if it has code it's a contract!
            length := extcodesize(a)
        }
        require(length > 0, 'no contract at this address');
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the calles is a ADMIN_UPDATER
     */
    modifier onlyAdminUpdater () {

        // hard-coded ADMIN_UPDATER role 1
        require(_roles[1][msg.sender] == true, 'only ADMIN_UPDATER allowed');
        _;
    }

    /**
     * @param newLogic the address of the new AdministrationLogic contract
     * @dev Updates the address of the AdministrationLogic this contract links to
     * @return true if the update was successful
     *
     * Only an ADMIN_UPDATER can call this function
     * We check if there is a real contract at the given address with 'isContract()'
     */
    function updateLogicContract(address newLogic)
        isContract(newLogic)
        onlyAdminUpdater
        public
        returns (bool)
    {
        administrationLogic = newLogic;
        return true;
    }

    /**
    * @dev This is the fallback function, it will be called when this contract
    * receives a call to an unknown function
    *
    * We use this intentionally to route function calls to our updatable logic contract.
    * This happens using assembly code and specifically the delegatecall opcode.
    * We essentially copy the calldata sent to this contract, perform the delegatecall,
    * copy the returndata and return it.
    * The special thing to understand here is that the storage variables
    * being manipulated reside in THIS contract which is the whole point, because it is why
    * we can update the logic contract without losing our data!
    */
    function() external {
        require(msg.sig != 0x0, 'no function identifier');

        address _impl = administrationLogic;

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, ptr, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return (ptr, size)}
        }
    }

}