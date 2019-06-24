pragma solidity 0.5.0;

/**
 * @dev we use a new interface here,
 *  because we will only ever need the isConstraintsUpdater function here
 *  and can hereby avoid a dependency
 */
interface AdministrationInterfaceForMaster {
    function isConstraintsUpdater(address account) external returns (bool);
}

/**
 * @author Simon Dosch
 * @title The proxy contract storing the userList mapping and linking to the constraints logic
 */
contract ConstraintsMaster {

    /**
     * @dev The Constraints Logic Contract
     */
    address private constraintsLogic;

    /**
     * @dev The Administration Interface used only for this contract
     */
    AdministrationInterfaceForMaster public _admin;

    /**
     * @dev Emitted whenever the constraints logic address is updated
     */
    event ConstraintsLogicUpdate(
        address msg_sender,
        address newLogic
    );

    /**
     * @param _impl the constraints logic address
     * @param adminAddress the admin master(proxy) address
     * @dev Sets the addresses for the ConstraintsLogic and the AdminMaster contract
     * The first can be updated, while the latter cannot be changed later on.
     */
    constructor (address _impl, AdministrationInterfaceForMaster adminAddress) public {
        constraintsLogic = _impl;
        _admin = adminAddress;
    }

    /**
     * @dev Returns the address of the contract currently set as the ConstraintsLogic contract
     * @return the address of the contract currently set as the ConstraintsLogic contract
     */
    function constraintsLogicAddress() public view returns (address) {
        return constraintsLogic;
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
     * @dev Modifier to make a function callable only when the calles is a CONSTRAINTS_UPDATER
     */
    modifier onlyConstraintsUpdater () {
        require(_admin.isConstraintsUpdater(msg.sender), 'only CONSTRAINTS_UPDATER allowed');
        _;
    }

    /**
     * @param newLogic the address of the new ConstraintsLogic contract
     * @dev Updates the address of the ConstraintsLogic this contract links to
     * @return true if the update was successful
     *
     * Only a CONSTRAINTS_UPDATER can call this function
     * We check if there is a real contract at the given address with 'isContract()'
     */
    function updateLogicContract(address newLogic)
        isContract(newLogic)
        onlyConstraintsUpdater
        public
        returns (bool)
    {
        constraintsLogic = newLogic;
        emit ConstraintsLogicUpdate(msg.sender, newLogic);
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

        address _impl = constraintsLogic;

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