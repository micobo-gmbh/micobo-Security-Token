pragma solidity ^0.5.0;

contract AdministrationInterface {


    // ADMIN

    function isAdmin(address account) external view returns (bool);

    function addAdmin(address account) external;

    function renounceAdmin() external;



    // MINTER

    function isMinter(address account) external view returns (bool);

    function addMinter(address account) external;

    function renounceMinter() external;

    function removeMinter(address account) external;


    // PAUSER

    function isPauser(address account) external view returns (bool);

    function addPauser(address account) external;

    function renouncePauser() external;

    function _removePauser(address account) external;

}