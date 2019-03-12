pragma solidity ^0.5.0;

interface AdministrationInterface {

    function administrationLogicAddress() external view returns (address);

    function add(uint8 role, address account) external;

    function remove(uint8 role, address account) external;

    function renounce(uint8 role) external;


    function isAdmin(address account) external view returns (bool);

    function isMinter(address account) external view returns (bool);

    function isPauser(address account) external view returns (bool);

    function isConstraintEditor(address account) external view returns (bool);

}