pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/IRelayRecipient.sol";
import "../../node_modules/@openzeppelin/contracts/GSN/GSNRecipient.sol";


contract GSNable is GSNRecipient {

    // override this function to add access control
    function isGSNController() internal view virtual returns (bool) {
        this;
        return true;
    }

    gsnMode _gsnMode = gsnMode.ALL;
    enum gsnMode {ALL, MODULE, NONE}

    IRelayRecipient private _gsnModule = IRelayRecipient(address(0));

    modifier onlyGSNController() {
        require(isGSNController(), "only GSN controller");
        _;
    }


    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external override view returns (uint256, bytes memory) {

        if(_gsnMode == gsnMode.ALL) {
            return _approveRelayedCall();
        } else if (_gsnMode == gsnMode.MODULE){
            return _gsnModule.acceptRelayedCall(
                relay,
                from,
                encodedFunction,
                transactionFee,
                gasPrice,
                gasLimit,
                nonce,
                approvalData,
                maxPossibleCharge
            );
        } else {
            return _rejectRelayedCall(0);
        }
    }

    function _preRelayedCall(bytes memory context) internal override returns (bytes32) {
        if (_gsnMode == gsnMode.MODULE) {
            return _gsnModule.preRelayedCall(context);
        }
    }

    function _postRelayedCall(
        bytes memory context,
        bool success,
        uint256 actualCharge,
        bytes32 preRetVal
    ) internal override{
        if (_gsnMode == gsnMode.MODULE) {
            return _gsnModule.postRelayedCall(context, success, actualCharge, preRetVal);
        }
    }


    function setGSNMode(gsnMode m) public onlyGSNController {
        _gsnMode = gsnMode(m);
    }

    function setGSNModuleAndActivate(IRelayRecipient newGSNModule) public onlyGSNController {
        _gsnModule = newGSNModule;
    }

    function upgradeRelayHub(address newRelayHub) public onlyGSNController {
        _upgradeRelayHub(newRelayHub);
    }

    function withdrawDeposits(uint256 amount, address payable payee) public onlyGSNController {
        _withdrawDeposits(amount, payee);
    }
}