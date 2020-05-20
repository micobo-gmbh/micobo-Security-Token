pragma solidity 0.6.6;

import "../../node_modules/@openzeppelin/contracts/GSN/IRelayRecipient.sol";
import "./GSNRecipient.sol";
import "../interfaces/IGSNable.sol";


contract GSNable is IGSNable, GSNRecipient {
	// override this function to add access control

	function _isGSNController() internal virtual view returns (bool) {
		this;
		return true;
	}

	gsnMode private _gsnMode = gsnMode.ALL;

	IRelayRecipient private _gsnModule = IRelayRecipient(address(0));

	modifier onlyGSNController() {
		require(_isGSNController(), "only GSN controller");
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
		if (_gsnMode == gsnMode.ALL) {
			return _approveRelayedCall();
		} else if (_gsnMode == gsnMode.MODULE) {
			return
				_gsnModule.acceptRelayedCall(
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
	) internal override {
		if (_gsnMode == gsnMode.MODULE) {
			return _gsnModule.postRelayedCall(context, success, actualCharge, preRetVal);
		}
	}

	function setGSNMode(gsnMode m) public override onlyGSNController {
		_gsnMode = gsnMode(m);
		emit GSNModeSet(m);
	}

	function getGSNMode() public override view onlyGSNController returns (gsnMode) {
		return _gsnMode;
	}

	function setGSNModule(IRelayRecipient newGSNModule) public override onlyGSNController {
		_gsnModule = newGSNModule;
		emit GSNModuleSet(newGSNModule);
	}

	function upgradeRelayHub(address newRelayHub) public override onlyGSNController {
		_upgradeRelayHub(newRelayHub);
	}

	function withdrawDeposits(uint256 amount, address payable payee) public override onlyGSNController {
		_withdrawDeposits(amount, payee);
	}
}
