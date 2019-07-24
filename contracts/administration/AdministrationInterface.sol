pragma solidity 0.5.0;

interface AdministrationInterface {

    event AdminLogicUpdate(address msg_sender, address newLogic);


    event RoleAdded(uint8 indexed role, address indexed account);
    event RoleRemoved(uint8 indexed role, address indexed account);
    event RoleRenounced(uint8 indexed role, address indexed account);


    function add(uint8 role, address account) external;

    function remove(uint8 role, address account) external;

    function renounce(uint8 role) external;


    function isAdmin(address account) external view returns (bool);

    function isMinter(address account) external view returns (bool);

    function isPauser(address account) external view returns (bool);

    function isConstraintsEditor(address account) external view returns (bool);

    function isConstraintsUpdater(address account) external view returns (bool);

    function isAdminUpdater(address account) external view returns (bool);

    function isBurner(address account) external view returns (bool);
}