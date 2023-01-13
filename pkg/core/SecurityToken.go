// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package core

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// SecurityTokenMetaData contains all meta data concerning the SecurityToken contract.
var SecurityTokenMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"AuthorizedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"AuthorizedOperatorByPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newCap\",\"type\":\"uint256\"}],\"name\":\"CapSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"fromPartition\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"toPartition\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"ChangedPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"name\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"uri\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"documentHash\",\"type\":\"bytes32\"}],\"name\":\"Document\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"enumSecurityTokenStorage.gsnMode\",\"name\":\"\",\"type\":\"uint8\"}],\"name\":\"GSNModeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"contractIRelayRecipient\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"GSNModuleSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Issued\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"IssuedByPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"contractIConstraintModule[]\",\"name\":\"newModules\",\"type\":\"address[]\"}],\"name\":\"ModulesByPartitionSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Redeemed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"RedeemedByPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"oldRelayHub\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newRelayHub\",\"type\":\"address\"}],\"name\":\"RelayHubChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"RevokedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"RevokedOperatorByPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"RoleRenounced\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"fromPartition\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"TransferByPartition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"TransferWithData\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"relay\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"encodedFunction\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"transactionFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"gasPrice\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"gasLimit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"approvalData\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"maxPossibleCharge\",\"type\":\"uint256\"}],\"name\":\"acceptRelayedCall\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"addRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"authorizeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"authorizeOperatorByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"balanceOfByPartition\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"roles\",\"type\":\"bytes32[]\"},{\"internalType\":\"address[]\",\"name\":\"accounts\",\"type\":\"address[]\"}],\"name\":\"bulkAddRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cap\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"}],\"name\":\"controllersByPartition\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getGSNMode\",\"outputs\":[{\"internalType\":\"enumSecurityTokenStorage.gsnMode\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getHubAddr\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"}],\"name\":\"getModulesByPartition\",\"outputs\":[{\"internalType\":\"contractIConstraintModule[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"granularity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"isOperator\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"isOperatorForPartition\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorTransferByPartition\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"partitionsOf\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"context\",\"type\":\"bytes\"},{\"internalType\":\"bool\",\"name\":\"success\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"actualCharge\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"preRetVal\",\"type\":\"bytes32\"}],\"name\":\"postRelayedCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"context\",\"type\":\"bytes\"}],\"name\":\"preRelayedCall\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"relayHubVersion\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"removeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"revokeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"revokeOperatorByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newCap\",\"type\":\"uint256\"}],\"name\":\"setCap\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enumSecurityTokenStorage.gsnMode\",\"name\":\"mode\",\"type\":\"uint8\"}],\"name\":\"setGSNMode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contractIRelayRecipient\",\"name\":\"newGSNModule\",\"type\":\"address\"}],\"name\":\"setGSNModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"contractIConstraintModule[]\",\"name\":\"newModules\",\"type\":\"address[]\"}],\"name\":\"setModulesByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalPartitions\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"}],\"name\":\"totalSupplyByPartition\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"transferByPartition\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"transferFromWithData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"transferWithData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newRelayHub\",\"type\":\"address\"}],\"name\":\"upgradeRelayHub\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"addresspayable\",\"name\":\"payee\",\"type\":\"address\"}],\"name\":\"withdrawDeposits\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"version\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"symbol\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"granularity\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"cap\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"controller\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"issuer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"redeemer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"module_editor\",\"type\":\"address\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address[]\",\"name\":\"tokenHolders\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"values\",\"type\":\"uint256[]\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"bulkIssueByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"documentName\",\"type\":\"bytes32\"}],\"name\":\"getDocument\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"documentName\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"uri\",\"type\":\"string\"},{\"internalType\":\"bytes32\",\"name\":\"documentHash\",\"type\":\"bytes32\"}],\"name\":\"setDocument\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"isControllable\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"isIssuable\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"issueByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"redeemByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"partition\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorRedeemByPartition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceControl\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceIssuance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// SecurityTokenABI is the input ABI used to generate the binding from.
// Deprecated: Use SecurityTokenMetaData.ABI instead.
var SecurityTokenABI = SecurityTokenMetaData.ABI

// SecurityToken is an auto generated Go binding around an Ethereum contract.
type SecurityToken struct {
	SecurityTokenCaller     // Read-only binding to the contract
	SecurityTokenTransactor // Write-only binding to the contract
	SecurityTokenFilterer   // Log filterer for contract events
}

// SecurityTokenCaller is an auto generated read-only Go binding around an Ethereum contract.
type SecurityTokenCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenTransactor is an auto generated write-only Go binding around an Ethereum contract.
type SecurityTokenTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type SecurityTokenFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type SecurityTokenSession struct {
	Contract     *SecurityToken    // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SecurityTokenCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type SecurityTokenCallerSession struct {
	Contract *SecurityTokenCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts        // Call options to use throughout this session
}

// SecurityTokenTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type SecurityTokenTransactorSession struct {
	Contract     *SecurityTokenTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts        // Transaction auth options to use throughout this session
}

// SecurityTokenRaw is an auto generated low-level Go binding around an Ethereum contract.
type SecurityTokenRaw struct {
	Contract *SecurityToken // Generic contract binding to access the raw methods on
}

// SecurityTokenCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type SecurityTokenCallerRaw struct {
	Contract *SecurityTokenCaller // Generic read-only contract binding to access the raw methods on
}

// SecurityTokenTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type SecurityTokenTransactorRaw struct {
	Contract *SecurityTokenTransactor // Generic write-only contract binding to access the raw methods on
}

// NewSecurityToken creates a new instance of SecurityToken, bound to a specific deployed contract.
func NewSecurityToken(address common.Address, backend bind.ContractBackend) (*SecurityToken, error) {
	contract, err := bindSecurityToken(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &SecurityToken{SecurityTokenCaller: SecurityTokenCaller{contract: contract}, SecurityTokenTransactor: SecurityTokenTransactor{contract: contract}, SecurityTokenFilterer: SecurityTokenFilterer{contract: contract}}, nil
}

// NewSecurityTokenCaller creates a new read-only instance of SecurityToken, bound to a specific deployed contract.
func NewSecurityTokenCaller(address common.Address, caller bind.ContractCaller) (*SecurityTokenCaller, error) {
	contract, err := bindSecurityToken(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenCaller{contract: contract}, nil
}

// NewSecurityTokenTransactor creates a new write-only instance of SecurityToken, bound to a specific deployed contract.
func NewSecurityTokenTransactor(address common.Address, transactor bind.ContractTransactor) (*SecurityTokenTransactor, error) {
	contract, err := bindSecurityToken(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenTransactor{contract: contract}, nil
}

// NewSecurityTokenFilterer creates a new log filterer instance of SecurityToken, bound to a specific deployed contract.
func NewSecurityTokenFilterer(address common.Address, filterer bind.ContractFilterer) (*SecurityTokenFilterer, error) {
	contract, err := bindSecurityToken(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFilterer{contract: contract}, nil
}

// bindSecurityToken binds a generic wrapper to an already deployed contract.
func bindSecurityToken(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(SecurityTokenABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SecurityToken *SecurityTokenRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SecurityToken.Contract.SecurityTokenCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SecurityToken *SecurityTokenRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.Contract.SecurityTokenTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SecurityToken *SecurityTokenRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SecurityToken.Contract.SecurityTokenTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SecurityToken *SecurityTokenCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SecurityToken.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SecurityToken *SecurityTokenTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SecurityToken *SecurityTokenTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SecurityToken.Contract.contract.Transact(opts, method, params...)
}

// AcceptRelayedCall is a free data retrieval call binding the contract method 0x83947ea0.
//
// Solidity: function acceptRelayedCall(address relay, address from, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes approvalData, uint256 maxPossibleCharge) view returns(uint256, bytes)
func (_SecurityToken *SecurityTokenCaller) AcceptRelayedCall(opts *bind.CallOpts, relay common.Address, from common.Address, encodedFunction []byte, transactionFee *big.Int, gasPrice *big.Int, gasLimit *big.Int, nonce *big.Int, approvalData []byte, maxPossibleCharge *big.Int) (*big.Int, []byte, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "acceptRelayedCall", relay, from, encodedFunction, transactionFee, gasPrice, gasLimit, nonce, approvalData, maxPossibleCharge)

	if err != nil {
		return *new(*big.Int), *new([]byte), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	out1 := *abi.ConvertType(out[1], new([]byte)).(*[]byte)

	return out0, out1, err

}

// AcceptRelayedCall is a free data retrieval call binding the contract method 0x83947ea0.
//
// Solidity: function acceptRelayedCall(address relay, address from, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes approvalData, uint256 maxPossibleCharge) view returns(uint256, bytes)
func (_SecurityToken *SecurityTokenSession) AcceptRelayedCall(relay common.Address, from common.Address, encodedFunction []byte, transactionFee *big.Int, gasPrice *big.Int, gasLimit *big.Int, nonce *big.Int, approvalData []byte, maxPossibleCharge *big.Int) (*big.Int, []byte, error) {
	return _SecurityToken.Contract.AcceptRelayedCall(&_SecurityToken.CallOpts, relay, from, encodedFunction, transactionFee, gasPrice, gasLimit, nonce, approvalData, maxPossibleCharge)
}

// AcceptRelayedCall is a free data retrieval call binding the contract method 0x83947ea0.
//
// Solidity: function acceptRelayedCall(address relay, address from, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes approvalData, uint256 maxPossibleCharge) view returns(uint256, bytes)
func (_SecurityToken *SecurityTokenCallerSession) AcceptRelayedCall(relay common.Address, from common.Address, encodedFunction []byte, transactionFee *big.Int, gasPrice *big.Int, gasLimit *big.Int, nonce *big.Int, approvalData []byte, maxPossibleCharge *big.Int) (*big.Int, []byte, error) {
	return _SecurityToken.Contract.AcceptRelayedCall(&_SecurityToken.CallOpts, relay, from, encodedFunction, transactionFee, gasPrice, gasLimit, nonce, approvalData, maxPossibleCharge)
}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) Allowance(opts *bind.CallOpts, owner common.Address, spender common.Address) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "allowance", owner, spender)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_SecurityToken *SecurityTokenSession) Allowance(owner common.Address, spender common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.Allowance(&_SecurityToken.CallOpts, owner, spender)
}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) Allowance(owner common.Address, spender common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.Allowance(&_SecurityToken.CallOpts, owner, spender)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address who) view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) BalanceOf(opts *bind.CallOpts, who common.Address) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "balanceOf", who)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address who) view returns(uint256)
func (_SecurityToken *SecurityTokenSession) BalanceOf(who common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.BalanceOf(&_SecurityToken.CallOpts, who)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address who) view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) BalanceOf(who common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.BalanceOf(&_SecurityToken.CallOpts, who)
}

// BalanceOfByPartition is a free data retrieval call binding the contract method 0x30e82803.
//
// Solidity: function balanceOfByPartition(bytes32 partition, address tokenHolder) view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) BalanceOfByPartition(opts *bind.CallOpts, partition [32]byte, tokenHolder common.Address) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "balanceOfByPartition", partition, tokenHolder)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOfByPartition is a free data retrieval call binding the contract method 0x30e82803.
//
// Solidity: function balanceOfByPartition(bytes32 partition, address tokenHolder) view returns(uint256)
func (_SecurityToken *SecurityTokenSession) BalanceOfByPartition(partition [32]byte, tokenHolder common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.BalanceOfByPartition(&_SecurityToken.CallOpts, partition, tokenHolder)
}

// BalanceOfByPartition is a free data retrieval call binding the contract method 0x30e82803.
//
// Solidity: function balanceOfByPartition(bytes32 partition, address tokenHolder) view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) BalanceOfByPartition(partition [32]byte, tokenHolder common.Address) (*big.Int, error) {
	return _SecurityToken.Contract.BalanceOfByPartition(&_SecurityToken.CallOpts, partition, tokenHolder)
}

// Cap is a free data retrieval call binding the contract method 0x355274ea.
//
// Solidity: function cap() view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) Cap(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "cap")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Cap is a free data retrieval call binding the contract method 0x355274ea.
//
// Solidity: function cap() view returns(uint256)
func (_SecurityToken *SecurityTokenSession) Cap() (*big.Int, error) {
	return _SecurityToken.Contract.Cap(&_SecurityToken.CallOpts)
}

// Cap is a free data retrieval call binding the contract method 0x355274ea.
//
// Solidity: function cap() view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) Cap() (*big.Int, error) {
	return _SecurityToken.Contract.Cap(&_SecurityToken.CallOpts)
}

// ControllersByPartition is a free data retrieval call binding the contract method 0x861ed3ea.
//
// Solidity: function controllersByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenCaller) ControllersByPartition(opts *bind.CallOpts, partition [32]byte) ([]common.Address, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "controllersByPartition", partition)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// ControllersByPartition is a free data retrieval call binding the contract method 0x861ed3ea.
//
// Solidity: function controllersByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenSession) ControllersByPartition(partition [32]byte) ([]common.Address, error) {
	return _SecurityToken.Contract.ControllersByPartition(&_SecurityToken.CallOpts, partition)
}

// ControllersByPartition is a free data retrieval call binding the contract method 0x861ed3ea.
//
// Solidity: function controllersByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenCallerSession) ControllersByPartition(partition [32]byte) ([]common.Address, error) {
	return _SecurityToken.Contract.ControllersByPartition(&_SecurityToken.CallOpts, partition)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() pure returns(uint8)
func (_SecurityToken *SecurityTokenCaller) Decimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "decimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() pure returns(uint8)
func (_SecurityToken *SecurityTokenSession) Decimals() (uint8, error) {
	return _SecurityToken.Contract.Decimals(&_SecurityToken.CallOpts)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() pure returns(uint8)
func (_SecurityToken *SecurityTokenCallerSession) Decimals() (uint8, error) {
	return _SecurityToken.Contract.Decimals(&_SecurityToken.CallOpts)
}

// GetDocument is a free data retrieval call binding the contract method 0xb10d6b41.
//
// Solidity: function getDocument(bytes32 documentName) view returns(string, bytes32)
func (_SecurityToken *SecurityTokenCaller) GetDocument(opts *bind.CallOpts, documentName [32]byte) (string, [32]byte, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "getDocument", documentName)

	if err != nil {
		return *new(string), *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	out1 := *abi.ConvertType(out[1], new([32]byte)).(*[32]byte)

	return out0, out1, err

}

// GetDocument is a free data retrieval call binding the contract method 0xb10d6b41.
//
// Solidity: function getDocument(bytes32 documentName) view returns(string, bytes32)
func (_SecurityToken *SecurityTokenSession) GetDocument(documentName [32]byte) (string, [32]byte, error) {
	return _SecurityToken.Contract.GetDocument(&_SecurityToken.CallOpts, documentName)
}

// GetDocument is a free data retrieval call binding the contract method 0xb10d6b41.
//
// Solidity: function getDocument(bytes32 documentName) view returns(string, bytes32)
func (_SecurityToken *SecurityTokenCallerSession) GetDocument(documentName [32]byte) (string, [32]byte, error) {
	return _SecurityToken.Contract.GetDocument(&_SecurityToken.CallOpts, documentName)
}

// GetGSNMode is a free data retrieval call binding the contract method 0x09ba46af.
//
// Solidity: function getGSNMode() view returns(uint8)
func (_SecurityToken *SecurityTokenCaller) GetGSNMode(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "getGSNMode")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// GetGSNMode is a free data retrieval call binding the contract method 0x09ba46af.
//
// Solidity: function getGSNMode() view returns(uint8)
func (_SecurityToken *SecurityTokenSession) GetGSNMode() (uint8, error) {
	return _SecurityToken.Contract.GetGSNMode(&_SecurityToken.CallOpts)
}

// GetGSNMode is a free data retrieval call binding the contract method 0x09ba46af.
//
// Solidity: function getGSNMode() view returns(uint8)
func (_SecurityToken *SecurityTokenCallerSession) GetGSNMode() (uint8, error) {
	return _SecurityToken.Contract.GetGSNMode(&_SecurityToken.CallOpts)
}

// GetHubAddr is a free data retrieval call binding the contract method 0x74e861d6.
//
// Solidity: function getHubAddr() view returns(address)
func (_SecurityToken *SecurityTokenCaller) GetHubAddr(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "getHubAddr")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetHubAddr is a free data retrieval call binding the contract method 0x74e861d6.
//
// Solidity: function getHubAddr() view returns(address)
func (_SecurityToken *SecurityTokenSession) GetHubAddr() (common.Address, error) {
	return _SecurityToken.Contract.GetHubAddr(&_SecurityToken.CallOpts)
}

// GetHubAddr is a free data retrieval call binding the contract method 0x74e861d6.
//
// Solidity: function getHubAddr() view returns(address)
func (_SecurityToken *SecurityTokenCallerSession) GetHubAddr() (common.Address, error) {
	return _SecurityToken.Contract.GetHubAddr(&_SecurityToken.CallOpts)
}

// GetModulesByPartition is a free data retrieval call binding the contract method 0xebd40593.
//
// Solidity: function getModulesByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenCaller) GetModulesByPartition(opts *bind.CallOpts, partition [32]byte) ([]common.Address, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "getModulesByPartition", partition)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// GetModulesByPartition is a free data retrieval call binding the contract method 0xebd40593.
//
// Solidity: function getModulesByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenSession) GetModulesByPartition(partition [32]byte) ([]common.Address, error) {
	return _SecurityToken.Contract.GetModulesByPartition(&_SecurityToken.CallOpts, partition)
}

// GetModulesByPartition is a free data retrieval call binding the contract method 0xebd40593.
//
// Solidity: function getModulesByPartition(bytes32 partition) view returns(address[])
func (_SecurityToken *SecurityTokenCallerSession) GetModulesByPartition(partition [32]byte) ([]common.Address, error) {
	return _SecurityToken.Contract.GetModulesByPartition(&_SecurityToken.CallOpts, partition)
}

// Granularity is a free data retrieval call binding the contract method 0x556f0dc7.
//
// Solidity: function granularity() view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) Granularity(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "granularity")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Granularity is a free data retrieval call binding the contract method 0x556f0dc7.
//
// Solidity: function granularity() view returns(uint256)
func (_SecurityToken *SecurityTokenSession) Granularity() (*big.Int, error) {
	return _SecurityToken.Contract.Granularity(&_SecurityToken.CallOpts)
}

// Granularity is a free data retrieval call binding the contract method 0x556f0dc7.
//
// Solidity: function granularity() view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) Granularity() (*big.Int, error) {
	return _SecurityToken.Contract.Granularity(&_SecurityToken.CallOpts)
}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_SecurityToken *SecurityTokenCaller) HasRole(opts *bind.CallOpts, role [32]byte, account common.Address) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "hasRole", role, account)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_SecurityToken *SecurityTokenSession) HasRole(role [32]byte, account common.Address) (bool, error) {
	return _SecurityToken.Contract.HasRole(&_SecurityToken.CallOpts, role, account)
}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) HasRole(role [32]byte, account common.Address) (bool, error) {
	return _SecurityToken.Contract.HasRole(&_SecurityToken.CallOpts, role, account)
}

// IsControllable is a free data retrieval call binding the contract method 0x4c783bf5.
//
// Solidity: function isControllable() view returns(bool)
func (_SecurityToken *SecurityTokenCaller) IsControllable(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "isControllable")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsControllable is a free data retrieval call binding the contract method 0x4c783bf5.
//
// Solidity: function isControllable() view returns(bool)
func (_SecurityToken *SecurityTokenSession) IsControllable() (bool, error) {
	return _SecurityToken.Contract.IsControllable(&_SecurityToken.CallOpts)
}

// IsControllable is a free data retrieval call binding the contract method 0x4c783bf5.
//
// Solidity: function isControllable() view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) IsControllable() (bool, error) {
	return _SecurityToken.Contract.IsControllable(&_SecurityToken.CallOpts)
}

// IsIssuable is a free data retrieval call binding the contract method 0x2f1cae85.
//
// Solidity: function isIssuable() view returns(bool)
func (_SecurityToken *SecurityTokenCaller) IsIssuable(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "isIssuable")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsIssuable is a free data retrieval call binding the contract method 0x2f1cae85.
//
// Solidity: function isIssuable() view returns(bool)
func (_SecurityToken *SecurityTokenSession) IsIssuable() (bool, error) {
	return _SecurityToken.Contract.IsIssuable(&_SecurityToken.CallOpts)
}

// IsIssuable is a free data retrieval call binding the contract method 0x2f1cae85.
//
// Solidity: function isIssuable() view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) IsIssuable() (bool, error) {
	return _SecurityToken.Contract.IsIssuable(&_SecurityToken.CallOpts)
}

// IsOperator is a free data retrieval call binding the contract method 0xb6363cf2.
//
// Solidity: function isOperator(address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenCaller) IsOperator(opts *bind.CallOpts, operator common.Address, tokenHolder common.Address) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "isOperator", operator, tokenHolder)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsOperator is a free data retrieval call binding the contract method 0xb6363cf2.
//
// Solidity: function isOperator(address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenSession) IsOperator(operator common.Address, tokenHolder common.Address) (bool, error) {
	return _SecurityToken.Contract.IsOperator(&_SecurityToken.CallOpts, operator, tokenHolder)
}

// IsOperator is a free data retrieval call binding the contract method 0xb6363cf2.
//
// Solidity: function isOperator(address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) IsOperator(operator common.Address, tokenHolder common.Address) (bool, error) {
	return _SecurityToken.Contract.IsOperator(&_SecurityToken.CallOpts, operator, tokenHolder)
}

// IsOperatorForPartition is a free data retrieval call binding the contract method 0x6d77cad6.
//
// Solidity: function isOperatorForPartition(bytes32 partition, address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenCaller) IsOperatorForPartition(opts *bind.CallOpts, partition [32]byte, operator common.Address, tokenHolder common.Address) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "isOperatorForPartition", partition, operator, tokenHolder)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsOperatorForPartition is a free data retrieval call binding the contract method 0x6d77cad6.
//
// Solidity: function isOperatorForPartition(bytes32 partition, address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenSession) IsOperatorForPartition(partition [32]byte, operator common.Address, tokenHolder common.Address) (bool, error) {
	return _SecurityToken.Contract.IsOperatorForPartition(&_SecurityToken.CallOpts, partition, operator, tokenHolder)
}

// IsOperatorForPartition is a free data retrieval call binding the contract method 0x6d77cad6.
//
// Solidity: function isOperatorForPartition(bytes32 partition, address operator, address tokenHolder) view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) IsOperatorForPartition(partition [32]byte, operator common.Address, tokenHolder common.Address) (bool, error) {
	return _SecurityToken.Contract.IsOperatorForPartition(&_SecurityToken.CallOpts, partition, operator, tokenHolder)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_SecurityToken *SecurityTokenCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_SecurityToken *SecurityTokenSession) Name() (string, error) {
	return _SecurityToken.Contract.Name(&_SecurityToken.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_SecurityToken *SecurityTokenCallerSession) Name() (string, error) {
	return _SecurityToken.Contract.Name(&_SecurityToken.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityToken *SecurityTokenCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityToken *SecurityTokenSession) Owner() (common.Address, error) {
	return _SecurityToken.Contract.Owner(&_SecurityToken.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityToken *SecurityTokenCallerSession) Owner() (common.Address, error) {
	return _SecurityToken.Contract.Owner(&_SecurityToken.CallOpts)
}

// PartitionsOf is a free data retrieval call binding the contract method 0x740ab8f4.
//
// Solidity: function partitionsOf(address tokenHolder) view returns(bytes32[])
func (_SecurityToken *SecurityTokenCaller) PartitionsOf(opts *bind.CallOpts, tokenHolder common.Address) ([][32]byte, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "partitionsOf", tokenHolder)

	if err != nil {
		return *new([][32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([][32]byte)).(*[][32]byte)

	return out0, err

}

// PartitionsOf is a free data retrieval call binding the contract method 0x740ab8f4.
//
// Solidity: function partitionsOf(address tokenHolder) view returns(bytes32[])
func (_SecurityToken *SecurityTokenSession) PartitionsOf(tokenHolder common.Address) ([][32]byte, error) {
	return _SecurityToken.Contract.PartitionsOf(&_SecurityToken.CallOpts, tokenHolder)
}

// PartitionsOf is a free data retrieval call binding the contract method 0x740ab8f4.
//
// Solidity: function partitionsOf(address tokenHolder) view returns(bytes32[])
func (_SecurityToken *SecurityTokenCallerSession) PartitionsOf(tokenHolder common.Address) ([][32]byte, error) {
	return _SecurityToken.Contract.PartitionsOf(&_SecurityToken.CallOpts, tokenHolder)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SecurityToken *SecurityTokenCaller) Paused(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "paused")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SecurityToken *SecurityTokenSession) Paused() (bool, error) {
	return _SecurityToken.Contract.Paused(&_SecurityToken.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SecurityToken *SecurityTokenCallerSession) Paused() (bool, error) {
	return _SecurityToken.Contract.Paused(&_SecurityToken.CallOpts)
}

// RelayHubVersion is a free data retrieval call binding the contract method 0xad61ccd5.
//
// Solidity: function relayHubVersion() view returns(string)
func (_SecurityToken *SecurityTokenCaller) RelayHubVersion(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "relayHubVersion")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// RelayHubVersion is a free data retrieval call binding the contract method 0xad61ccd5.
//
// Solidity: function relayHubVersion() view returns(string)
func (_SecurityToken *SecurityTokenSession) RelayHubVersion() (string, error) {
	return _SecurityToken.Contract.RelayHubVersion(&_SecurityToken.CallOpts)
}

// RelayHubVersion is a free data retrieval call binding the contract method 0xad61ccd5.
//
// Solidity: function relayHubVersion() view returns(string)
func (_SecurityToken *SecurityTokenCallerSession) RelayHubVersion() (string, error) {
	return _SecurityToken.Contract.RelayHubVersion(&_SecurityToken.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_SecurityToken *SecurityTokenCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_SecurityToken *SecurityTokenSession) Symbol() (string, error) {
	return _SecurityToken.Contract.Symbol(&_SecurityToken.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_SecurityToken *SecurityTokenCallerSession) Symbol() (string, error) {
	return _SecurityToken.Contract.Symbol(&_SecurityToken.CallOpts)
}

// TotalPartitions is a free data retrieval call binding the contract method 0x69598efe.
//
// Solidity: function totalPartitions() view returns(bytes32[])
func (_SecurityToken *SecurityTokenCaller) TotalPartitions(opts *bind.CallOpts) ([][32]byte, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "totalPartitions")

	if err != nil {
		return *new([][32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([][32]byte)).(*[][32]byte)

	return out0, err

}

// TotalPartitions is a free data retrieval call binding the contract method 0x69598efe.
//
// Solidity: function totalPartitions() view returns(bytes32[])
func (_SecurityToken *SecurityTokenSession) TotalPartitions() ([][32]byte, error) {
	return _SecurityToken.Contract.TotalPartitions(&_SecurityToken.CallOpts)
}

// TotalPartitions is a free data retrieval call binding the contract method 0x69598efe.
//
// Solidity: function totalPartitions() view returns(bytes32[])
func (_SecurityToken *SecurityTokenCallerSession) TotalPartitions() ([][32]byte, error) {
	return _SecurityToken.Contract.TotalPartitions(&_SecurityToken.CallOpts)
}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) TotalSupply(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "totalSupply")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_SecurityToken *SecurityTokenSession) TotalSupply() (*big.Int, error) {
	return _SecurityToken.Contract.TotalSupply(&_SecurityToken.CallOpts)
}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) TotalSupply() (*big.Int, error) {
	return _SecurityToken.Contract.TotalSupply(&_SecurityToken.CallOpts)
}

// TotalSupplyByPartition is a free data retrieval call binding the contract method 0xa26734dc.
//
// Solidity: function totalSupplyByPartition(bytes32 partition) view returns(uint256)
func (_SecurityToken *SecurityTokenCaller) TotalSupplyByPartition(opts *bind.CallOpts, partition [32]byte) (*big.Int, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "totalSupplyByPartition", partition)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalSupplyByPartition is a free data retrieval call binding the contract method 0xa26734dc.
//
// Solidity: function totalSupplyByPartition(bytes32 partition) view returns(uint256)
func (_SecurityToken *SecurityTokenSession) TotalSupplyByPartition(partition [32]byte) (*big.Int, error) {
	return _SecurityToken.Contract.TotalSupplyByPartition(&_SecurityToken.CallOpts, partition)
}

// TotalSupplyByPartition is a free data retrieval call binding the contract method 0xa26734dc.
//
// Solidity: function totalSupplyByPartition(bytes32 partition) view returns(uint256)
func (_SecurityToken *SecurityTokenCallerSession) TotalSupplyByPartition(partition [32]byte) (*big.Int, error) {
	return _SecurityToken.Contract.TotalSupplyByPartition(&_SecurityToken.CallOpts, partition)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(string)
func (_SecurityToken *SecurityTokenCaller) Version(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _SecurityToken.contract.Call(opts, &out, "version")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(string)
func (_SecurityToken *SecurityTokenSession) Version() (string, error) {
	return _SecurityToken.Contract.Version(&_SecurityToken.CallOpts)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(string)
func (_SecurityToken *SecurityTokenCallerSession) Version() (string, error) {
	return _SecurityToken.Contract.Version(&_SecurityToken.CallOpts)
}

// AddRole is a paid mutator transaction binding the contract method 0xe959b38a.
//
// Solidity: function addRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenTransactor) AddRole(opts *bind.TransactOpts, role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "addRole", role, account)
}

// AddRole is a paid mutator transaction binding the contract method 0xe959b38a.
//
// Solidity: function addRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenSession) AddRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AddRole(&_SecurityToken.TransactOpts, role, account)
}

// AddRole is a paid mutator transaction binding the contract method 0xe959b38a.
//
// Solidity: function addRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenTransactorSession) AddRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AddRole(&_SecurityToken.TransactOpts, role, account)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactor) Approve(opts *bind.TransactOpts, spender common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "approve", spender, value)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenSession) Approve(spender common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.Approve(&_SecurityToken.TransactOpts, spender, value)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactorSession) Approve(spender common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.Approve(&_SecurityToken.TransactOpts, spender, value)
}

// AuthorizeOperator is a paid mutator transaction binding the contract method 0x959b8c3f.
//
// Solidity: function authorizeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenTransactor) AuthorizeOperator(opts *bind.TransactOpts, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "authorizeOperator", operator)
}

// AuthorizeOperator is a paid mutator transaction binding the contract method 0x959b8c3f.
//
// Solidity: function authorizeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenSession) AuthorizeOperator(operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AuthorizeOperator(&_SecurityToken.TransactOpts, operator)
}

// AuthorizeOperator is a paid mutator transaction binding the contract method 0x959b8c3f.
//
// Solidity: function authorizeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenTransactorSession) AuthorizeOperator(operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AuthorizeOperator(&_SecurityToken.TransactOpts, operator)
}

// AuthorizeOperatorByPartition is a paid mutator transaction binding the contract method 0x103ef9e1.
//
// Solidity: function authorizeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenTransactor) AuthorizeOperatorByPartition(opts *bind.TransactOpts, partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "authorizeOperatorByPartition", partition, operator)
}

// AuthorizeOperatorByPartition is a paid mutator transaction binding the contract method 0x103ef9e1.
//
// Solidity: function authorizeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenSession) AuthorizeOperatorByPartition(partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AuthorizeOperatorByPartition(&_SecurityToken.TransactOpts, partition, operator)
}

// AuthorizeOperatorByPartition is a paid mutator transaction binding the contract method 0x103ef9e1.
//
// Solidity: function authorizeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenTransactorSession) AuthorizeOperatorByPartition(partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.AuthorizeOperatorByPartition(&_SecurityToken.TransactOpts, partition, operator)
}

// BulkAddRole is a paid mutator transaction binding the contract method 0xe47278f2.
//
// Solidity: function bulkAddRole(bytes32[] roles, address[] accounts) returns()
func (_SecurityToken *SecurityTokenTransactor) BulkAddRole(opts *bind.TransactOpts, roles [][32]byte, accounts []common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "bulkAddRole", roles, accounts)
}

// BulkAddRole is a paid mutator transaction binding the contract method 0xe47278f2.
//
// Solidity: function bulkAddRole(bytes32[] roles, address[] accounts) returns()
func (_SecurityToken *SecurityTokenSession) BulkAddRole(roles [][32]byte, accounts []common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.BulkAddRole(&_SecurityToken.TransactOpts, roles, accounts)
}

// BulkAddRole is a paid mutator transaction binding the contract method 0xe47278f2.
//
// Solidity: function bulkAddRole(bytes32[] roles, address[] accounts) returns()
func (_SecurityToken *SecurityTokenTransactorSession) BulkAddRole(roles [][32]byte, accounts []common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.BulkAddRole(&_SecurityToken.TransactOpts, roles, accounts)
}

// BulkIssueByPartition is a paid mutator transaction binding the contract method 0x9268ea22.
//
// Solidity: function bulkIssueByPartition(bytes32 partition, address[] tokenHolders, uint256[] values, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactor) BulkIssueByPartition(opts *bind.TransactOpts, partition [32]byte, tokenHolders []common.Address, values []*big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "bulkIssueByPartition", partition, tokenHolders, values, data)
}

// BulkIssueByPartition is a paid mutator transaction binding the contract method 0x9268ea22.
//
// Solidity: function bulkIssueByPartition(bytes32 partition, address[] tokenHolders, uint256[] values, bytes data) returns()
func (_SecurityToken *SecurityTokenSession) BulkIssueByPartition(partition [32]byte, tokenHolders []common.Address, values []*big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.BulkIssueByPartition(&_SecurityToken.TransactOpts, partition, tokenHolders, values, data)
}

// BulkIssueByPartition is a paid mutator transaction binding the contract method 0x9268ea22.
//
// Solidity: function bulkIssueByPartition(bytes32 partition, address[] tokenHolders, uint256[] values, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactorSession) BulkIssueByPartition(partition [32]byte, tokenHolders []common.Address, values []*big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.BulkIssueByPartition(&_SecurityToken.TransactOpts, partition, tokenHolders, values, data)
}

// Initialize is a paid mutator transaction binding the contract method 0x13272dda.
//
// Solidity: function initialize(string name, string symbol, uint256 granularity, uint256 cap, address admin, address controller, address issuer, address redeemer, address module_editor) returns()
func (_SecurityToken *SecurityTokenTransactor) Initialize(opts *bind.TransactOpts, name string, symbol string, granularity *big.Int, cap *big.Int, admin common.Address, controller common.Address, issuer common.Address, redeemer common.Address, module_editor common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "initialize", name, symbol, granularity, cap, admin, controller, issuer, redeemer, module_editor)
}

// Initialize is a paid mutator transaction binding the contract method 0x13272dda.
//
// Solidity: function initialize(string name, string symbol, uint256 granularity, uint256 cap, address admin, address controller, address issuer, address redeemer, address module_editor) returns()
func (_SecurityToken *SecurityTokenSession) Initialize(name string, symbol string, granularity *big.Int, cap *big.Int, admin common.Address, controller common.Address, issuer common.Address, redeemer common.Address, module_editor common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.Initialize(&_SecurityToken.TransactOpts, name, symbol, granularity, cap, admin, controller, issuer, redeemer, module_editor)
}

// Initialize is a paid mutator transaction binding the contract method 0x13272dda.
//
// Solidity: function initialize(string name, string symbol, uint256 granularity, uint256 cap, address admin, address controller, address issuer, address redeemer, address module_editor) returns()
func (_SecurityToken *SecurityTokenTransactorSession) Initialize(name string, symbol string, granularity *big.Int, cap *big.Int, admin common.Address, controller common.Address, issuer common.Address, redeemer common.Address, module_editor common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.Initialize(&_SecurityToken.TransactOpts, name, symbol, granularity, cap, admin, controller, issuer, redeemer, module_editor)
}

// IssueByPartition is a paid mutator transaction binding the contract method 0x67c84919.
//
// Solidity: function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactor) IssueByPartition(opts *bind.TransactOpts, partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "issueByPartition", partition, tokenHolder, value, data)
}

// IssueByPartition is a paid mutator transaction binding the contract method 0x67c84919.
//
// Solidity: function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenSession) IssueByPartition(partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.IssueByPartition(&_SecurityToken.TransactOpts, partition, tokenHolder, value, data)
}

// IssueByPartition is a paid mutator transaction binding the contract method 0x67c84919.
//
// Solidity: function issueByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactorSession) IssueByPartition(partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.IssueByPartition(&_SecurityToken.TransactOpts, partition, tokenHolder, value, data)
}

// OperatorRedeemByPartition is a paid mutator transaction binding the contract method 0x13d557bc.
//
// Solidity: function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenTransactor) OperatorRedeemByPartition(opts *bind.TransactOpts, partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "operatorRedeemByPartition", partition, tokenHolder, value, data, operatorData)
}

// OperatorRedeemByPartition is a paid mutator transaction binding the contract method 0x13d557bc.
//
// Solidity: function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenSession) OperatorRedeemByPartition(partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.OperatorRedeemByPartition(&_SecurityToken.TransactOpts, partition, tokenHolder, value, data, operatorData)
}

// OperatorRedeemByPartition is a paid mutator transaction binding the contract method 0x13d557bc.
//
// Solidity: function operatorRedeemByPartition(bytes32 partition, address tokenHolder, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenTransactorSession) OperatorRedeemByPartition(partition [32]byte, tokenHolder common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.OperatorRedeemByPartition(&_SecurityToken.TransactOpts, partition, tokenHolder, value, data, operatorData)
}

// OperatorTransferByPartition is a paid mutator transaction binding the contract method 0x8c0dee9c.
//
// Solidity: function operatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes data, bytes operatorData) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactor) OperatorTransferByPartition(opts *bind.TransactOpts, partition [32]byte, from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "operatorTransferByPartition", partition, from, to, value, data, operatorData)
}

// OperatorTransferByPartition is a paid mutator transaction binding the contract method 0x8c0dee9c.
//
// Solidity: function operatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes data, bytes operatorData) returns(bytes32)
func (_SecurityToken *SecurityTokenSession) OperatorTransferByPartition(partition [32]byte, from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.OperatorTransferByPartition(&_SecurityToken.TransactOpts, partition, from, to, value, data, operatorData)
}

// OperatorTransferByPartition is a paid mutator transaction binding the contract method 0x8c0dee9c.
//
// Solidity: function operatorTransferByPartition(bytes32 partition, address from, address to, uint256 value, bytes data, bytes operatorData) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactorSession) OperatorTransferByPartition(partition [32]byte, from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.OperatorTransferByPartition(&_SecurityToken.TransactOpts, partition, from, to, value, data, operatorData)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SecurityToken *SecurityTokenTransactor) Pause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "pause")
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SecurityToken *SecurityTokenSession) Pause() (*types.Transaction, error) {
	return _SecurityToken.Contract.Pause(&_SecurityToken.TransactOpts)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SecurityToken *SecurityTokenTransactorSession) Pause() (*types.Transaction, error) {
	return _SecurityToken.Contract.Pause(&_SecurityToken.TransactOpts)
}

// PostRelayedCall is a paid mutator transaction binding the contract method 0xe06e0e22.
//
// Solidity: function postRelayedCall(bytes context, bool success, uint256 actualCharge, bytes32 preRetVal) returns()
func (_SecurityToken *SecurityTokenTransactor) PostRelayedCall(opts *bind.TransactOpts, context []byte, success bool, actualCharge *big.Int, preRetVal [32]byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "postRelayedCall", context, success, actualCharge, preRetVal)
}

// PostRelayedCall is a paid mutator transaction binding the contract method 0xe06e0e22.
//
// Solidity: function postRelayedCall(bytes context, bool success, uint256 actualCharge, bytes32 preRetVal) returns()
func (_SecurityToken *SecurityTokenSession) PostRelayedCall(context []byte, success bool, actualCharge *big.Int, preRetVal [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.PostRelayedCall(&_SecurityToken.TransactOpts, context, success, actualCharge, preRetVal)
}

// PostRelayedCall is a paid mutator transaction binding the contract method 0xe06e0e22.
//
// Solidity: function postRelayedCall(bytes context, bool success, uint256 actualCharge, bytes32 preRetVal) returns()
func (_SecurityToken *SecurityTokenTransactorSession) PostRelayedCall(context []byte, success bool, actualCharge *big.Int, preRetVal [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.PostRelayedCall(&_SecurityToken.TransactOpts, context, success, actualCharge, preRetVal)
}

// PreRelayedCall is a paid mutator transaction binding the contract method 0x80274db7.
//
// Solidity: function preRelayedCall(bytes context) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactor) PreRelayedCall(opts *bind.TransactOpts, context []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "preRelayedCall", context)
}

// PreRelayedCall is a paid mutator transaction binding the contract method 0x80274db7.
//
// Solidity: function preRelayedCall(bytes context) returns(bytes32)
func (_SecurityToken *SecurityTokenSession) PreRelayedCall(context []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.PreRelayedCall(&_SecurityToken.TransactOpts, context)
}

// PreRelayedCall is a paid mutator transaction binding the contract method 0x80274db7.
//
// Solidity: function preRelayedCall(bytes context) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactorSession) PreRelayedCall(context []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.PreRelayedCall(&_SecurityToken.TransactOpts, context)
}

// RedeemByPartition is a paid mutator transaction binding the contract method 0x62eb0068.
//
// Solidity: function redeemByPartition(bytes32 partition, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactor) RedeemByPartition(opts *bind.TransactOpts, partition [32]byte, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "redeemByPartition", partition, value, data)
}

// RedeemByPartition is a paid mutator transaction binding the contract method 0x62eb0068.
//
// Solidity: function redeemByPartition(bytes32 partition, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenSession) RedeemByPartition(partition [32]byte, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.RedeemByPartition(&_SecurityToken.TransactOpts, partition, value, data)
}

// RedeemByPartition is a paid mutator transaction binding the contract method 0x62eb0068.
//
// Solidity: function redeemByPartition(bytes32 partition, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactorSession) RedeemByPartition(partition [32]byte, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.RedeemByPartition(&_SecurityToken.TransactOpts, partition, value, data)
}

// RemoveRole is a paid mutator transaction binding the contract method 0xf6ba0007.
//
// Solidity: function removeRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenTransactor) RemoveRole(opts *bind.TransactOpts, role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "removeRole", role, account)
}

// RemoveRole is a paid mutator transaction binding the contract method 0xf6ba0007.
//
// Solidity: function removeRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenSession) RemoveRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RemoveRole(&_SecurityToken.TransactOpts, role, account)
}

// RemoveRole is a paid mutator transaction binding the contract method 0xf6ba0007.
//
// Solidity: function removeRole(bytes32 role, address account) returns()
func (_SecurityToken *SecurityTokenTransactorSession) RemoveRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RemoveRole(&_SecurityToken.TransactOpts, role, account)
}

// RenounceControl is a paid mutator transaction binding the contract method 0xca281fd9.
//
// Solidity: function renounceControl() returns()
func (_SecurityToken *SecurityTokenTransactor) RenounceControl(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "renounceControl")
}

// RenounceControl is a paid mutator transaction binding the contract method 0xca281fd9.
//
// Solidity: function renounceControl() returns()
func (_SecurityToken *SecurityTokenSession) RenounceControl() (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceControl(&_SecurityToken.TransactOpts)
}

// RenounceControl is a paid mutator transaction binding the contract method 0xca281fd9.
//
// Solidity: function renounceControl() returns()
func (_SecurityToken *SecurityTokenTransactorSession) RenounceControl() (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceControl(&_SecurityToken.TransactOpts)
}

// RenounceIssuance is a paid mutator transaction binding the contract method 0x6c30d170.
//
// Solidity: function renounceIssuance() returns()
func (_SecurityToken *SecurityTokenTransactor) RenounceIssuance(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "renounceIssuance")
}

// RenounceIssuance is a paid mutator transaction binding the contract method 0x6c30d170.
//
// Solidity: function renounceIssuance() returns()
func (_SecurityToken *SecurityTokenSession) RenounceIssuance() (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceIssuance(&_SecurityToken.TransactOpts)
}

// RenounceIssuance is a paid mutator transaction binding the contract method 0x6c30d170.
//
// Solidity: function renounceIssuance() returns()
func (_SecurityToken *SecurityTokenTransactorSession) RenounceIssuance() (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceIssuance(&_SecurityToken.TransactOpts)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_SecurityToken *SecurityTokenTransactor) RenounceRole(opts *bind.TransactOpts, role [32]byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "renounceRole", role)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_SecurityToken *SecurityTokenSession) RenounceRole(role [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceRole(&_SecurityToken.TransactOpts, role)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_SecurityToken *SecurityTokenTransactorSession) RenounceRole(role [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.RenounceRole(&_SecurityToken.TransactOpts, role)
}

// RevokeOperator is a paid mutator transaction binding the contract method 0xfad8b32a.
//
// Solidity: function revokeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenTransactor) RevokeOperator(opts *bind.TransactOpts, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "revokeOperator", operator)
}

// RevokeOperator is a paid mutator transaction binding the contract method 0xfad8b32a.
//
// Solidity: function revokeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenSession) RevokeOperator(operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RevokeOperator(&_SecurityToken.TransactOpts, operator)
}

// RevokeOperator is a paid mutator transaction binding the contract method 0xfad8b32a.
//
// Solidity: function revokeOperator(address operator) returns()
func (_SecurityToken *SecurityTokenTransactorSession) RevokeOperator(operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RevokeOperator(&_SecurityToken.TransactOpts, operator)
}

// RevokeOperatorByPartition is a paid mutator transaction binding the contract method 0x168ecec5.
//
// Solidity: function revokeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenTransactor) RevokeOperatorByPartition(opts *bind.TransactOpts, partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "revokeOperatorByPartition", partition, operator)
}

// RevokeOperatorByPartition is a paid mutator transaction binding the contract method 0x168ecec5.
//
// Solidity: function revokeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenSession) RevokeOperatorByPartition(partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RevokeOperatorByPartition(&_SecurityToken.TransactOpts, partition, operator)
}

// RevokeOperatorByPartition is a paid mutator transaction binding the contract method 0x168ecec5.
//
// Solidity: function revokeOperatorByPartition(bytes32 partition, address operator) returns()
func (_SecurityToken *SecurityTokenTransactorSession) RevokeOperatorByPartition(partition [32]byte, operator common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.RevokeOperatorByPartition(&_SecurityToken.TransactOpts, partition, operator)
}

// SetCap is a paid mutator transaction binding the contract method 0x47786d37.
//
// Solidity: function setCap(uint256 newCap) returns()
func (_SecurityToken *SecurityTokenTransactor) SetCap(opts *bind.TransactOpts, newCap *big.Int) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "setCap", newCap)
}

// SetCap is a paid mutator transaction binding the contract method 0x47786d37.
//
// Solidity: function setCap(uint256 newCap) returns()
func (_SecurityToken *SecurityTokenSession) SetCap(newCap *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetCap(&_SecurityToken.TransactOpts, newCap)
}

// SetCap is a paid mutator transaction binding the contract method 0x47786d37.
//
// Solidity: function setCap(uint256 newCap) returns()
func (_SecurityToken *SecurityTokenTransactorSession) SetCap(newCap *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetCap(&_SecurityToken.TransactOpts, newCap)
}

// SetDocument is a paid mutator transaction binding the contract method 0x010648ca.
//
// Solidity: function setDocument(bytes32 documentName, string uri, bytes32 documentHash) returns()
func (_SecurityToken *SecurityTokenTransactor) SetDocument(opts *bind.TransactOpts, documentName [32]byte, uri string, documentHash [32]byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "setDocument", documentName, uri, documentHash)
}

// SetDocument is a paid mutator transaction binding the contract method 0x010648ca.
//
// Solidity: function setDocument(bytes32 documentName, string uri, bytes32 documentHash) returns()
func (_SecurityToken *SecurityTokenSession) SetDocument(documentName [32]byte, uri string, documentHash [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetDocument(&_SecurityToken.TransactOpts, documentName, uri, documentHash)
}

// SetDocument is a paid mutator transaction binding the contract method 0x010648ca.
//
// Solidity: function setDocument(bytes32 documentName, string uri, bytes32 documentHash) returns()
func (_SecurityToken *SecurityTokenTransactorSession) SetDocument(documentName [32]byte, uri string, documentHash [32]byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetDocument(&_SecurityToken.TransactOpts, documentName, uri, documentHash)
}

// SetGSNMode is a paid mutator transaction binding the contract method 0x9161af66.
//
// Solidity: function setGSNMode(uint8 mode) returns()
func (_SecurityToken *SecurityTokenTransactor) SetGSNMode(opts *bind.TransactOpts, mode uint8) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "setGSNMode", mode)
}

// SetGSNMode is a paid mutator transaction binding the contract method 0x9161af66.
//
// Solidity: function setGSNMode(uint8 mode) returns()
func (_SecurityToken *SecurityTokenSession) SetGSNMode(mode uint8) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetGSNMode(&_SecurityToken.TransactOpts, mode)
}

// SetGSNMode is a paid mutator transaction binding the contract method 0x9161af66.
//
// Solidity: function setGSNMode(uint8 mode) returns()
func (_SecurityToken *SecurityTokenTransactorSession) SetGSNMode(mode uint8) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetGSNMode(&_SecurityToken.TransactOpts, mode)
}

// SetGSNModule is a paid mutator transaction binding the contract method 0xc40b1532.
//
// Solidity: function setGSNModule(address newGSNModule) returns()
func (_SecurityToken *SecurityTokenTransactor) SetGSNModule(opts *bind.TransactOpts, newGSNModule common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "setGSNModule", newGSNModule)
}

// SetGSNModule is a paid mutator transaction binding the contract method 0xc40b1532.
//
// Solidity: function setGSNModule(address newGSNModule) returns()
func (_SecurityToken *SecurityTokenSession) SetGSNModule(newGSNModule common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetGSNModule(&_SecurityToken.TransactOpts, newGSNModule)
}

// SetGSNModule is a paid mutator transaction binding the contract method 0xc40b1532.
//
// Solidity: function setGSNModule(address newGSNModule) returns()
func (_SecurityToken *SecurityTokenTransactorSession) SetGSNModule(newGSNModule common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetGSNModule(&_SecurityToken.TransactOpts, newGSNModule)
}

// SetModulesByPartition is a paid mutator transaction binding the contract method 0x526e738f.
//
// Solidity: function setModulesByPartition(bytes32 partition, address[] newModules) returns()
func (_SecurityToken *SecurityTokenTransactor) SetModulesByPartition(opts *bind.TransactOpts, partition [32]byte, newModules []common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "setModulesByPartition", partition, newModules)
}

// SetModulesByPartition is a paid mutator transaction binding the contract method 0x526e738f.
//
// Solidity: function setModulesByPartition(bytes32 partition, address[] newModules) returns()
func (_SecurityToken *SecurityTokenSession) SetModulesByPartition(partition [32]byte, newModules []common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetModulesByPartition(&_SecurityToken.TransactOpts, partition, newModules)
}

// SetModulesByPartition is a paid mutator transaction binding the contract method 0x526e738f.
//
// Solidity: function setModulesByPartition(bytes32 partition, address[] newModules) returns()
func (_SecurityToken *SecurityTokenTransactorSession) SetModulesByPartition(partition [32]byte, newModules []common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.SetModulesByPartition(&_SecurityToken.TransactOpts, partition, newModules)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactor) Transfer(opts *bind.TransactOpts, to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transfer", to, value)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenSession) Transfer(to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.Transfer(&_SecurityToken.TransactOpts, to, value)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactorSession) Transfer(to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.Transfer(&_SecurityToken.TransactOpts, to, value)
}

// TransferByPartition is a paid mutator transaction binding the contract method 0xf3d490db.
//
// Solidity: function transferByPartition(bytes32 partition, address to, uint256 value, bytes data) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactor) TransferByPartition(opts *bind.TransactOpts, partition [32]byte, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transferByPartition", partition, to, value, data)
}

// TransferByPartition is a paid mutator transaction binding the contract method 0xf3d490db.
//
// Solidity: function transferByPartition(bytes32 partition, address to, uint256 value, bytes data) returns(bytes32)
func (_SecurityToken *SecurityTokenSession) TransferByPartition(partition [32]byte, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferByPartition(&_SecurityToken.TransactOpts, partition, to, value, data)
}

// TransferByPartition is a paid mutator transaction binding the contract method 0xf3d490db.
//
// Solidity: function transferByPartition(bytes32 partition, address to, uint256 value, bytes data) returns(bytes32)
func (_SecurityToken *SecurityTokenTransactorSession) TransferByPartition(partition [32]byte, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferByPartition(&_SecurityToken.TransactOpts, partition, to, value, data)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactor) TransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transferFrom", from, to, value)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenSession) TransferFrom(from common.Address, to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferFrom(&_SecurityToken.TransactOpts, from, to, value)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 value) returns(bool)
func (_SecurityToken *SecurityTokenTransactorSession) TransferFrom(from common.Address, to common.Address, value *big.Int) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferFrom(&_SecurityToken.TransactOpts, from, to, value)
}

// TransferFromWithData is a paid mutator transaction binding the contract method 0x868d5383.
//
// Solidity: function transferFromWithData(address from, address to, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenTransactor) TransferFromWithData(opts *bind.TransactOpts, from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transferFromWithData", from, to, value, data, operatorData)
}

// TransferFromWithData is a paid mutator transaction binding the contract method 0x868d5383.
//
// Solidity: function transferFromWithData(address from, address to, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenSession) TransferFromWithData(from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferFromWithData(&_SecurityToken.TransactOpts, from, to, value, data, operatorData)
}

// TransferFromWithData is a paid mutator transaction binding the contract method 0x868d5383.
//
// Solidity: function transferFromWithData(address from, address to, uint256 value, bytes data, bytes operatorData) returns()
func (_SecurityToken *SecurityTokenTransactorSession) TransferFromWithData(from common.Address, to common.Address, value *big.Int, data []byte, operatorData []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferFromWithData(&_SecurityToken.TransactOpts, from, to, value, data, operatorData)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityToken *SecurityTokenTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityToken *SecurityTokenSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferOwnership(&_SecurityToken.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityToken *SecurityTokenTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferOwnership(&_SecurityToken.TransactOpts, newOwner)
}

// TransferWithData is a paid mutator transaction binding the contract method 0x2535f762.
//
// Solidity: function transferWithData(address to, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactor) TransferWithData(opts *bind.TransactOpts, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "transferWithData", to, value, data)
}

// TransferWithData is a paid mutator transaction binding the contract method 0x2535f762.
//
// Solidity: function transferWithData(address to, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenSession) TransferWithData(to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferWithData(&_SecurityToken.TransactOpts, to, value, data)
}

// TransferWithData is a paid mutator transaction binding the contract method 0x2535f762.
//
// Solidity: function transferWithData(address to, uint256 value, bytes data) returns()
func (_SecurityToken *SecurityTokenTransactorSession) TransferWithData(to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _SecurityToken.Contract.TransferWithData(&_SecurityToken.TransactOpts, to, value, data)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SecurityToken *SecurityTokenTransactor) Unpause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "unpause")
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SecurityToken *SecurityTokenSession) Unpause() (*types.Transaction, error) {
	return _SecurityToken.Contract.Unpause(&_SecurityToken.TransactOpts)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SecurityToken *SecurityTokenTransactorSession) Unpause() (*types.Transaction, error) {
	return _SecurityToken.Contract.Unpause(&_SecurityToken.TransactOpts)
}

// UpgradeRelayHub is a paid mutator transaction binding the contract method 0x9e30a590.
//
// Solidity: function upgradeRelayHub(address newRelayHub) returns()
func (_SecurityToken *SecurityTokenTransactor) UpgradeRelayHub(opts *bind.TransactOpts, newRelayHub common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "upgradeRelayHub", newRelayHub)
}

// UpgradeRelayHub is a paid mutator transaction binding the contract method 0x9e30a590.
//
// Solidity: function upgradeRelayHub(address newRelayHub) returns()
func (_SecurityToken *SecurityTokenSession) UpgradeRelayHub(newRelayHub common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.UpgradeRelayHub(&_SecurityToken.TransactOpts, newRelayHub)
}

// UpgradeRelayHub is a paid mutator transaction binding the contract method 0x9e30a590.
//
// Solidity: function upgradeRelayHub(address newRelayHub) returns()
func (_SecurityToken *SecurityTokenTransactorSession) UpgradeRelayHub(newRelayHub common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.UpgradeRelayHub(&_SecurityToken.TransactOpts, newRelayHub)
}

// WithdrawDeposits is a paid mutator transaction binding the contract method 0xc2db1abe.
//
// Solidity: function withdrawDeposits(uint256 amount, address payee) returns()
func (_SecurityToken *SecurityTokenTransactor) WithdrawDeposits(opts *bind.TransactOpts, amount *big.Int, payee common.Address) (*types.Transaction, error) {
	return _SecurityToken.contract.Transact(opts, "withdrawDeposits", amount, payee)
}

// WithdrawDeposits is a paid mutator transaction binding the contract method 0xc2db1abe.
//
// Solidity: function withdrawDeposits(uint256 amount, address payee) returns()
func (_SecurityToken *SecurityTokenSession) WithdrawDeposits(amount *big.Int, payee common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.WithdrawDeposits(&_SecurityToken.TransactOpts, amount, payee)
}

// WithdrawDeposits is a paid mutator transaction binding the contract method 0xc2db1abe.
//
// Solidity: function withdrawDeposits(uint256 amount, address payee) returns()
func (_SecurityToken *SecurityTokenTransactorSession) WithdrawDeposits(amount *big.Int, payee common.Address) (*types.Transaction, error) {
	return _SecurityToken.Contract.WithdrawDeposits(&_SecurityToken.TransactOpts, amount, payee)
}

// SecurityTokenApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the SecurityToken contract.
type SecurityTokenApprovalIterator struct {
	Event *SecurityTokenApproval // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenApproval)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenApproval)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenApproval represents a Approval event raised by the SecurityToken contract.
type SecurityTokenApproval struct {
	Owner   common.Address
	Spender common.Address
	Value   *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, spender []common.Address) (*SecurityTokenApprovalIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var spenderRule []interface{}
	for _, spenderItem := range spender {
		spenderRule = append(spenderRule, spenderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Approval", ownerRule, spenderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenApprovalIterator{contract: _SecurityToken.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *SecurityTokenApproval, owner []common.Address, spender []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var spenderRule []interface{}
	for _, spenderItem := range spender {
		spenderRule = append(spenderRule, spenderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Approval", ownerRule, spenderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenApproval)
				if err := _SecurityToken.contract.UnpackLog(event, "Approval", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApproval is a log parse operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) ParseApproval(log types.Log) (*SecurityTokenApproval, error) {
	event := new(SecurityTokenApproval)
	if err := _SecurityToken.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenAuthorizedOperatorIterator is returned from FilterAuthorizedOperator and is used to iterate over the raw logs and unpacked data for AuthorizedOperator events raised by the SecurityToken contract.
type SecurityTokenAuthorizedOperatorIterator struct {
	Event *SecurityTokenAuthorizedOperator // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenAuthorizedOperatorIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenAuthorizedOperator)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenAuthorizedOperator)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenAuthorizedOperatorIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenAuthorizedOperatorIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenAuthorizedOperator represents a AuthorizedOperator event raised by the SecurityToken contract.
type SecurityTokenAuthorizedOperator struct {
	Operator    common.Address
	TokenHolder common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterAuthorizedOperator is a free log retrieval operation binding the contract event 0xf4caeb2d6ca8932a215a353d0703c326ec2d81fc68170f320eb2ab49e9df61f9.
//
// Solidity: event AuthorizedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) FilterAuthorizedOperator(opts *bind.FilterOpts, operator []common.Address, tokenHolder []common.Address) (*SecurityTokenAuthorizedOperatorIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "AuthorizedOperator", operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenAuthorizedOperatorIterator{contract: _SecurityToken.contract, event: "AuthorizedOperator", logs: logs, sub: sub}, nil
}

// WatchAuthorizedOperator is a free log subscription operation binding the contract event 0xf4caeb2d6ca8932a215a353d0703c326ec2d81fc68170f320eb2ab49e9df61f9.
//
// Solidity: event AuthorizedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) WatchAuthorizedOperator(opts *bind.WatchOpts, sink chan<- *SecurityTokenAuthorizedOperator, operator []common.Address, tokenHolder []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "AuthorizedOperator", operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenAuthorizedOperator)
				if err := _SecurityToken.contract.UnpackLog(event, "AuthorizedOperator", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAuthorizedOperator is a log parse operation binding the contract event 0xf4caeb2d6ca8932a215a353d0703c326ec2d81fc68170f320eb2ab49e9df61f9.
//
// Solidity: event AuthorizedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) ParseAuthorizedOperator(log types.Log) (*SecurityTokenAuthorizedOperator, error) {
	event := new(SecurityTokenAuthorizedOperator)
	if err := _SecurityToken.contract.UnpackLog(event, "AuthorizedOperator", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenAuthorizedOperatorByPartitionIterator is returned from FilterAuthorizedOperatorByPartition and is used to iterate over the raw logs and unpacked data for AuthorizedOperatorByPartition events raised by the SecurityToken contract.
type SecurityTokenAuthorizedOperatorByPartitionIterator struct {
	Event *SecurityTokenAuthorizedOperatorByPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenAuthorizedOperatorByPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenAuthorizedOperatorByPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenAuthorizedOperatorByPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenAuthorizedOperatorByPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenAuthorizedOperatorByPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenAuthorizedOperatorByPartition represents a AuthorizedOperatorByPartition event raised by the SecurityToken contract.
type SecurityTokenAuthorizedOperatorByPartition struct {
	Partition   [32]byte
	Operator    common.Address
	TokenHolder common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterAuthorizedOperatorByPartition is a free log retrieval operation binding the contract event 0x3646a897c70797ecc134b0adc32f471b07bf1d6f451133b0384badab531e3fd6.
//
// Solidity: event AuthorizedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) FilterAuthorizedOperatorByPartition(opts *bind.FilterOpts, partition [][32]byte, operator []common.Address, tokenHolder []common.Address) (*SecurityTokenAuthorizedOperatorByPartitionIterator, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "AuthorizedOperatorByPartition", partitionRule, operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenAuthorizedOperatorByPartitionIterator{contract: _SecurityToken.contract, event: "AuthorizedOperatorByPartition", logs: logs, sub: sub}, nil
}

// WatchAuthorizedOperatorByPartition is a free log subscription operation binding the contract event 0x3646a897c70797ecc134b0adc32f471b07bf1d6f451133b0384badab531e3fd6.
//
// Solidity: event AuthorizedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) WatchAuthorizedOperatorByPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenAuthorizedOperatorByPartition, partition [][32]byte, operator []common.Address, tokenHolder []common.Address) (event.Subscription, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "AuthorizedOperatorByPartition", partitionRule, operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenAuthorizedOperatorByPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "AuthorizedOperatorByPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAuthorizedOperatorByPartition is a log parse operation binding the contract event 0x3646a897c70797ecc134b0adc32f471b07bf1d6f451133b0384badab531e3fd6.
//
// Solidity: event AuthorizedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) ParseAuthorizedOperatorByPartition(log types.Log) (*SecurityTokenAuthorizedOperatorByPartition, error) {
	event := new(SecurityTokenAuthorizedOperatorByPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "AuthorizedOperatorByPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenCapSetIterator is returned from FilterCapSet and is used to iterate over the raw logs and unpacked data for CapSet events raised by the SecurityToken contract.
type SecurityTokenCapSetIterator struct {
	Event *SecurityTokenCapSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenCapSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenCapSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenCapSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenCapSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenCapSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenCapSet represents a CapSet event raised by the SecurityToken contract.
type SecurityTokenCapSet struct {
	NewCap *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterCapSet is a free log retrieval operation binding the contract event 0x9872d5eb566b79923d043f1b59aca655ca80a2bb5b6bca4824e515b0e398902f.
//
// Solidity: event CapSet(uint256 newCap)
func (_SecurityToken *SecurityTokenFilterer) FilterCapSet(opts *bind.FilterOpts) (*SecurityTokenCapSetIterator, error) {

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "CapSet")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenCapSetIterator{contract: _SecurityToken.contract, event: "CapSet", logs: logs, sub: sub}, nil
}

// WatchCapSet is a free log subscription operation binding the contract event 0x9872d5eb566b79923d043f1b59aca655ca80a2bb5b6bca4824e515b0e398902f.
//
// Solidity: event CapSet(uint256 newCap)
func (_SecurityToken *SecurityTokenFilterer) WatchCapSet(opts *bind.WatchOpts, sink chan<- *SecurityTokenCapSet) (event.Subscription, error) {

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "CapSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenCapSet)
				if err := _SecurityToken.contract.UnpackLog(event, "CapSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseCapSet is a log parse operation binding the contract event 0x9872d5eb566b79923d043f1b59aca655ca80a2bb5b6bca4824e515b0e398902f.
//
// Solidity: event CapSet(uint256 newCap)
func (_SecurityToken *SecurityTokenFilterer) ParseCapSet(log types.Log) (*SecurityTokenCapSet, error) {
	event := new(SecurityTokenCapSet)
	if err := _SecurityToken.contract.UnpackLog(event, "CapSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenChangedPartitionIterator is returned from FilterChangedPartition and is used to iterate over the raw logs and unpacked data for ChangedPartition events raised by the SecurityToken contract.
type SecurityTokenChangedPartitionIterator struct {
	Event *SecurityTokenChangedPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenChangedPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenChangedPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenChangedPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenChangedPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenChangedPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenChangedPartition represents a ChangedPartition event raised by the SecurityToken contract.
type SecurityTokenChangedPartition struct {
	FromPartition [32]byte
	ToPartition   [32]byte
	Value         *big.Int
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterChangedPartition is a free log retrieval operation binding the contract event 0x67c8ba31d2dd11f1384577b3405b04ed91eed1231e408432ad2458cab37b2fa1.
//
// Solidity: event ChangedPartition(bytes32 indexed fromPartition, bytes32 indexed toPartition, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) FilterChangedPartition(opts *bind.FilterOpts, fromPartition [][32]byte, toPartition [][32]byte) (*SecurityTokenChangedPartitionIterator, error) {

	var fromPartitionRule []interface{}
	for _, fromPartitionItem := range fromPartition {
		fromPartitionRule = append(fromPartitionRule, fromPartitionItem)
	}
	var toPartitionRule []interface{}
	for _, toPartitionItem := range toPartition {
		toPartitionRule = append(toPartitionRule, toPartitionItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "ChangedPartition", fromPartitionRule, toPartitionRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenChangedPartitionIterator{contract: _SecurityToken.contract, event: "ChangedPartition", logs: logs, sub: sub}, nil
}

// WatchChangedPartition is a free log subscription operation binding the contract event 0x67c8ba31d2dd11f1384577b3405b04ed91eed1231e408432ad2458cab37b2fa1.
//
// Solidity: event ChangedPartition(bytes32 indexed fromPartition, bytes32 indexed toPartition, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) WatchChangedPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenChangedPartition, fromPartition [][32]byte, toPartition [][32]byte) (event.Subscription, error) {

	var fromPartitionRule []interface{}
	for _, fromPartitionItem := range fromPartition {
		fromPartitionRule = append(fromPartitionRule, fromPartitionItem)
	}
	var toPartitionRule []interface{}
	for _, toPartitionItem := range toPartition {
		toPartitionRule = append(toPartitionRule, toPartitionItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "ChangedPartition", fromPartitionRule, toPartitionRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenChangedPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "ChangedPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseChangedPartition is a log parse operation binding the contract event 0x67c8ba31d2dd11f1384577b3405b04ed91eed1231e408432ad2458cab37b2fa1.
//
// Solidity: event ChangedPartition(bytes32 indexed fromPartition, bytes32 indexed toPartition, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) ParseChangedPartition(log types.Log) (*SecurityTokenChangedPartition, error) {
	event := new(SecurityTokenChangedPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "ChangedPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenDocumentIterator is returned from FilterDocument and is used to iterate over the raw logs and unpacked data for Document events raised by the SecurityToken contract.
type SecurityTokenDocumentIterator struct {
	Event *SecurityTokenDocument // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenDocumentIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenDocument)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenDocument)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenDocumentIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenDocumentIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenDocument represents a Document event raised by the SecurityToken contract.
type SecurityTokenDocument struct {
	Name         [32]byte
	Uri          string
	DocumentHash [32]byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterDocument is a free log retrieval operation binding the contract event 0x89730c201d2df6a4cef4e892559e63e022078b0ee939d11b6ced61fb098b2824.
//
// Solidity: event Document(bytes32 indexed name, string uri, bytes32 documentHash)
func (_SecurityToken *SecurityTokenFilterer) FilterDocument(opts *bind.FilterOpts, name [][32]byte) (*SecurityTokenDocumentIterator, error) {

	var nameRule []interface{}
	for _, nameItem := range name {
		nameRule = append(nameRule, nameItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Document", nameRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenDocumentIterator{contract: _SecurityToken.contract, event: "Document", logs: logs, sub: sub}, nil
}

// WatchDocument is a free log subscription operation binding the contract event 0x89730c201d2df6a4cef4e892559e63e022078b0ee939d11b6ced61fb098b2824.
//
// Solidity: event Document(bytes32 indexed name, string uri, bytes32 documentHash)
func (_SecurityToken *SecurityTokenFilterer) WatchDocument(opts *bind.WatchOpts, sink chan<- *SecurityTokenDocument, name [][32]byte) (event.Subscription, error) {

	var nameRule []interface{}
	for _, nameItem := range name {
		nameRule = append(nameRule, nameItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Document", nameRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenDocument)
				if err := _SecurityToken.contract.UnpackLog(event, "Document", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDocument is a log parse operation binding the contract event 0x89730c201d2df6a4cef4e892559e63e022078b0ee939d11b6ced61fb098b2824.
//
// Solidity: event Document(bytes32 indexed name, string uri, bytes32 documentHash)
func (_SecurityToken *SecurityTokenFilterer) ParseDocument(log types.Log) (*SecurityTokenDocument, error) {
	event := new(SecurityTokenDocument)
	if err := _SecurityToken.contract.UnpackLog(event, "Document", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenGSNModeSetIterator is returned from FilterGSNModeSet and is used to iterate over the raw logs and unpacked data for GSNModeSet events raised by the SecurityToken contract.
type SecurityTokenGSNModeSetIterator struct {
	Event *SecurityTokenGSNModeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenGSNModeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenGSNModeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenGSNModeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenGSNModeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenGSNModeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenGSNModeSet represents a GSNModeSet event raised by the SecurityToken contract.
type SecurityTokenGSNModeSet struct {
	Arg0 uint8
	Raw  types.Log // Blockchain specific contextual infos
}

// FilterGSNModeSet is a free log retrieval operation binding the contract event 0xe02649bc382f86d3ff61a3d3ac35298268c6fd005dc19f86fd8aaddc8f57e7e1.
//
// Solidity: event GSNModeSet(uint8 arg0)
func (_SecurityToken *SecurityTokenFilterer) FilterGSNModeSet(opts *bind.FilterOpts) (*SecurityTokenGSNModeSetIterator, error) {

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "GSNModeSet")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenGSNModeSetIterator{contract: _SecurityToken.contract, event: "GSNModeSet", logs: logs, sub: sub}, nil
}

// WatchGSNModeSet is a free log subscription operation binding the contract event 0xe02649bc382f86d3ff61a3d3ac35298268c6fd005dc19f86fd8aaddc8f57e7e1.
//
// Solidity: event GSNModeSet(uint8 arg0)
func (_SecurityToken *SecurityTokenFilterer) WatchGSNModeSet(opts *bind.WatchOpts, sink chan<- *SecurityTokenGSNModeSet) (event.Subscription, error) {

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "GSNModeSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenGSNModeSet)
				if err := _SecurityToken.contract.UnpackLog(event, "GSNModeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseGSNModeSet is a log parse operation binding the contract event 0xe02649bc382f86d3ff61a3d3ac35298268c6fd005dc19f86fd8aaddc8f57e7e1.
//
// Solidity: event GSNModeSet(uint8 arg0)
func (_SecurityToken *SecurityTokenFilterer) ParseGSNModeSet(log types.Log) (*SecurityTokenGSNModeSet, error) {
	event := new(SecurityTokenGSNModeSet)
	if err := _SecurityToken.contract.UnpackLog(event, "GSNModeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenGSNModuleSetIterator is returned from FilterGSNModuleSet and is used to iterate over the raw logs and unpacked data for GSNModuleSet events raised by the SecurityToken contract.
type SecurityTokenGSNModuleSetIterator struct {
	Event *SecurityTokenGSNModuleSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenGSNModuleSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenGSNModuleSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenGSNModuleSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenGSNModuleSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenGSNModuleSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenGSNModuleSet represents a GSNModuleSet event raised by the SecurityToken contract.
type SecurityTokenGSNModuleSet struct {
	Arg0 common.Address
	Raw  types.Log // Blockchain specific contextual infos
}

// FilterGSNModuleSet is a free log retrieval operation binding the contract event 0xa992d2724f07b7a2ca2d78ba7ae0cb8ee6bee416e4208e5935d7cc5264c4f233.
//
// Solidity: event GSNModuleSet(address arg0)
func (_SecurityToken *SecurityTokenFilterer) FilterGSNModuleSet(opts *bind.FilterOpts) (*SecurityTokenGSNModuleSetIterator, error) {

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "GSNModuleSet")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenGSNModuleSetIterator{contract: _SecurityToken.contract, event: "GSNModuleSet", logs: logs, sub: sub}, nil
}

// WatchGSNModuleSet is a free log subscription operation binding the contract event 0xa992d2724f07b7a2ca2d78ba7ae0cb8ee6bee416e4208e5935d7cc5264c4f233.
//
// Solidity: event GSNModuleSet(address arg0)
func (_SecurityToken *SecurityTokenFilterer) WatchGSNModuleSet(opts *bind.WatchOpts, sink chan<- *SecurityTokenGSNModuleSet) (event.Subscription, error) {

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "GSNModuleSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenGSNModuleSet)
				if err := _SecurityToken.contract.UnpackLog(event, "GSNModuleSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseGSNModuleSet is a log parse operation binding the contract event 0xa992d2724f07b7a2ca2d78ba7ae0cb8ee6bee416e4208e5935d7cc5264c4f233.
//
// Solidity: event GSNModuleSet(address arg0)
func (_SecurityToken *SecurityTokenFilterer) ParseGSNModuleSet(log types.Log) (*SecurityTokenGSNModuleSet, error) {
	event := new(SecurityTokenGSNModuleSet)
	if err := _SecurityToken.contract.UnpackLog(event, "GSNModuleSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenIssuedIterator is returned from FilterIssued and is used to iterate over the raw logs and unpacked data for Issued events raised by the SecurityToken contract.
type SecurityTokenIssuedIterator struct {
	Event *SecurityTokenIssued // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenIssuedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenIssued)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenIssued)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenIssuedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenIssuedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenIssued represents a Issued event raised by the SecurityToken contract.
type SecurityTokenIssued struct {
	Operator     common.Address
	To           common.Address
	Value        *big.Int
	Data         []byte
	OperatorData []byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterIssued is a free log retrieval operation binding the contract event 0x4790eb24c76c5a304db5d1b4d9999370bcc2c8dca19d21a3bbe094ca35ecbf57.
//
// Solidity: event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterIssued(opts *bind.FilterOpts, operator []common.Address, to []common.Address) (*SecurityTokenIssuedIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Issued", operatorRule, toRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenIssuedIterator{contract: _SecurityToken.contract, event: "Issued", logs: logs, sub: sub}, nil
}

// WatchIssued is a free log subscription operation binding the contract event 0x4790eb24c76c5a304db5d1b4d9999370bcc2c8dca19d21a3bbe094ca35ecbf57.
//
// Solidity: event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchIssued(opts *bind.WatchOpts, sink chan<- *SecurityTokenIssued, operator []common.Address, to []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Issued", operatorRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenIssued)
				if err := _SecurityToken.contract.UnpackLog(event, "Issued", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIssued is a log parse operation binding the contract event 0x4790eb24c76c5a304db5d1b4d9999370bcc2c8dca19d21a3bbe094ca35ecbf57.
//
// Solidity: event Issued(address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseIssued(log types.Log) (*SecurityTokenIssued, error) {
	event := new(SecurityTokenIssued)
	if err := _SecurityToken.contract.UnpackLog(event, "Issued", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenIssuedByPartitionIterator is returned from FilterIssuedByPartition and is used to iterate over the raw logs and unpacked data for IssuedByPartition events raised by the SecurityToken contract.
type SecurityTokenIssuedByPartitionIterator struct {
	Event *SecurityTokenIssuedByPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenIssuedByPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenIssuedByPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenIssuedByPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenIssuedByPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenIssuedByPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenIssuedByPartition represents a IssuedByPartition event raised by the SecurityToken contract.
type SecurityTokenIssuedByPartition struct {
	Partition    [32]byte
	Operator     common.Address
	To           common.Address
	Value        *big.Int
	Data         []byte
	OperatorData []byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterIssuedByPartition is a free log retrieval operation binding the contract event 0xf0ded82afbb1bb3ff3fc48cb2a26584aa84e4af0bf309c804ecdb94d0f6a98bb.
//
// Solidity: event IssuedByPartition(bytes32 indexed partition, address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterIssuedByPartition(opts *bind.FilterOpts, partition [][32]byte, operator []common.Address, to []common.Address) (*SecurityTokenIssuedByPartitionIterator, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "IssuedByPartition", partitionRule, operatorRule, toRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenIssuedByPartitionIterator{contract: _SecurityToken.contract, event: "IssuedByPartition", logs: logs, sub: sub}, nil
}

// WatchIssuedByPartition is a free log subscription operation binding the contract event 0xf0ded82afbb1bb3ff3fc48cb2a26584aa84e4af0bf309c804ecdb94d0f6a98bb.
//
// Solidity: event IssuedByPartition(bytes32 indexed partition, address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchIssuedByPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenIssuedByPartition, partition [][32]byte, operator []common.Address, to []common.Address) (event.Subscription, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "IssuedByPartition", partitionRule, operatorRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenIssuedByPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "IssuedByPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIssuedByPartition is a log parse operation binding the contract event 0xf0ded82afbb1bb3ff3fc48cb2a26584aa84e4af0bf309c804ecdb94d0f6a98bb.
//
// Solidity: event IssuedByPartition(bytes32 indexed partition, address indexed operator, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseIssuedByPartition(log types.Log) (*SecurityTokenIssuedByPartition, error) {
	event := new(SecurityTokenIssuedByPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "IssuedByPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenModulesByPartitionSetIterator is returned from FilterModulesByPartitionSet and is used to iterate over the raw logs and unpacked data for ModulesByPartitionSet events raised by the SecurityToken contract.
type SecurityTokenModulesByPartitionSetIterator struct {
	Event *SecurityTokenModulesByPartitionSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenModulesByPartitionSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenModulesByPartitionSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenModulesByPartitionSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenModulesByPartitionSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenModulesByPartitionSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenModulesByPartitionSet represents a ModulesByPartitionSet event raised by the SecurityToken contract.
type SecurityTokenModulesByPartitionSet struct {
	Caller     common.Address
	Partition  [32]byte
	NewModules []common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterModulesByPartitionSet is a free log retrieval operation binding the contract event 0x930309f219bda9447ecff513b403fa071b98338b16a4ada934016d2bb44c64c8.
//
// Solidity: event ModulesByPartitionSet(address indexed caller, bytes32 indexed partition, address[] newModules)
func (_SecurityToken *SecurityTokenFilterer) FilterModulesByPartitionSet(opts *bind.FilterOpts, caller []common.Address, partition [][32]byte) (*SecurityTokenModulesByPartitionSetIterator, error) {

	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}
	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "ModulesByPartitionSet", callerRule, partitionRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenModulesByPartitionSetIterator{contract: _SecurityToken.contract, event: "ModulesByPartitionSet", logs: logs, sub: sub}, nil
}

// WatchModulesByPartitionSet is a free log subscription operation binding the contract event 0x930309f219bda9447ecff513b403fa071b98338b16a4ada934016d2bb44c64c8.
//
// Solidity: event ModulesByPartitionSet(address indexed caller, bytes32 indexed partition, address[] newModules)
func (_SecurityToken *SecurityTokenFilterer) WatchModulesByPartitionSet(opts *bind.WatchOpts, sink chan<- *SecurityTokenModulesByPartitionSet, caller []common.Address, partition [][32]byte) (event.Subscription, error) {

	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}
	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "ModulesByPartitionSet", callerRule, partitionRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenModulesByPartitionSet)
				if err := _SecurityToken.contract.UnpackLog(event, "ModulesByPartitionSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModulesByPartitionSet is a log parse operation binding the contract event 0x930309f219bda9447ecff513b403fa071b98338b16a4ada934016d2bb44c64c8.
//
// Solidity: event ModulesByPartitionSet(address indexed caller, bytes32 indexed partition, address[] newModules)
func (_SecurityToken *SecurityTokenFilterer) ParseModulesByPartitionSet(log types.Log) (*SecurityTokenModulesByPartitionSet, error) {
	event := new(SecurityTokenModulesByPartitionSet)
	if err := _SecurityToken.contract.UnpackLog(event, "ModulesByPartitionSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the SecurityToken contract.
type SecurityTokenOwnershipTransferredIterator struct {
	Event *SecurityTokenOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenOwnershipTransferred represents a OwnershipTransferred event raised by the SecurityToken contract.
type SecurityTokenOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SecurityToken *SecurityTokenFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*SecurityTokenOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenOwnershipTransferredIterator{contract: _SecurityToken.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SecurityToken *SecurityTokenFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *SecurityTokenOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenOwnershipTransferred)
				if err := _SecurityToken.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SecurityToken *SecurityTokenFilterer) ParseOwnershipTransferred(log types.Log) (*SecurityTokenOwnershipTransferred, error) {
	event := new(SecurityTokenOwnershipTransferred)
	if err := _SecurityToken.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenPausedIterator is returned from FilterPaused and is used to iterate over the raw logs and unpacked data for Paused events raised by the SecurityToken contract.
type SecurityTokenPausedIterator struct {
	Event *SecurityTokenPaused // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenPausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenPaused)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenPaused)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenPausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenPausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenPaused represents a Paused event raised by the SecurityToken contract.
type SecurityTokenPaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterPaused is a free log retrieval operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_SecurityToken *SecurityTokenFilterer) FilterPaused(opts *bind.FilterOpts) (*SecurityTokenPausedIterator, error) {

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenPausedIterator{contract: _SecurityToken.contract, event: "Paused", logs: logs, sub: sub}, nil
}

// WatchPaused is a free log subscription operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_SecurityToken *SecurityTokenFilterer) WatchPaused(opts *bind.WatchOpts, sink chan<- *SecurityTokenPaused) (event.Subscription, error) {

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenPaused)
				if err := _SecurityToken.contract.UnpackLog(event, "Paused", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParsePaused is a log parse operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_SecurityToken *SecurityTokenFilterer) ParsePaused(log types.Log) (*SecurityTokenPaused, error) {
	event := new(SecurityTokenPaused)
	if err := _SecurityToken.contract.UnpackLog(event, "Paused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRedeemedIterator is returned from FilterRedeemed and is used to iterate over the raw logs and unpacked data for Redeemed events raised by the SecurityToken contract.
type SecurityTokenRedeemedIterator struct {
	Event *SecurityTokenRedeemed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRedeemedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRedeemed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRedeemed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRedeemedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRedeemedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRedeemed represents a Redeemed event raised by the SecurityToken contract.
type SecurityTokenRedeemed struct {
	Operator     common.Address
	From         common.Address
	Value        *big.Int
	Data         []byte
	OperatorData []byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterRedeemed is a free log retrieval operation binding the contract event 0x1f58e3485c3f6fc2bddf52e2bd0d82ad5c19e1ac9ab403b1aa9f0a1794d2bfb6.
//
// Solidity: event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterRedeemed(opts *bind.FilterOpts, operator []common.Address, from []common.Address) (*SecurityTokenRedeemedIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Redeemed", operatorRule, fromRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRedeemedIterator{contract: _SecurityToken.contract, event: "Redeemed", logs: logs, sub: sub}, nil
}

// WatchRedeemed is a free log subscription operation binding the contract event 0x1f58e3485c3f6fc2bddf52e2bd0d82ad5c19e1ac9ab403b1aa9f0a1794d2bfb6.
//
// Solidity: event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchRedeemed(opts *bind.WatchOpts, sink chan<- *SecurityTokenRedeemed, operator []common.Address, from []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Redeemed", operatorRule, fromRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRedeemed)
				if err := _SecurityToken.contract.UnpackLog(event, "Redeemed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRedeemed is a log parse operation binding the contract event 0x1f58e3485c3f6fc2bddf52e2bd0d82ad5c19e1ac9ab403b1aa9f0a1794d2bfb6.
//
// Solidity: event Redeemed(address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseRedeemed(log types.Log) (*SecurityTokenRedeemed, error) {
	event := new(SecurityTokenRedeemed)
	if err := _SecurityToken.contract.UnpackLog(event, "Redeemed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRedeemedByPartitionIterator is returned from FilterRedeemedByPartition and is used to iterate over the raw logs and unpacked data for RedeemedByPartition events raised by the SecurityToken contract.
type SecurityTokenRedeemedByPartitionIterator struct {
	Event *SecurityTokenRedeemedByPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRedeemedByPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRedeemedByPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRedeemedByPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRedeemedByPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRedeemedByPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRedeemedByPartition represents a RedeemedByPartition event raised by the SecurityToken contract.
type SecurityTokenRedeemedByPartition struct {
	Partition    [32]byte
	Operator     common.Address
	From         common.Address
	Value        *big.Int
	Data         []byte
	OperatorData []byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterRedeemedByPartition is a free log retrieval operation binding the contract event 0xa4f62471c9bdf88115b97203943c74c59b655913ee5ee592706d84ef53fb6be2.
//
// Solidity: event RedeemedByPartition(bytes32 indexed partition, address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterRedeemedByPartition(opts *bind.FilterOpts, partition [][32]byte, operator []common.Address, from []common.Address) (*SecurityTokenRedeemedByPartitionIterator, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RedeemedByPartition", partitionRule, operatorRule, fromRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRedeemedByPartitionIterator{contract: _SecurityToken.contract, event: "RedeemedByPartition", logs: logs, sub: sub}, nil
}

// WatchRedeemedByPartition is a free log subscription operation binding the contract event 0xa4f62471c9bdf88115b97203943c74c59b655913ee5ee592706d84ef53fb6be2.
//
// Solidity: event RedeemedByPartition(bytes32 indexed partition, address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchRedeemedByPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenRedeemedByPartition, partition [][32]byte, operator []common.Address, from []common.Address) (event.Subscription, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RedeemedByPartition", partitionRule, operatorRule, fromRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRedeemedByPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "RedeemedByPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRedeemedByPartition is a log parse operation binding the contract event 0xa4f62471c9bdf88115b97203943c74c59b655913ee5ee592706d84ef53fb6be2.
//
// Solidity: event RedeemedByPartition(bytes32 indexed partition, address indexed operator, address indexed from, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseRedeemedByPartition(log types.Log) (*SecurityTokenRedeemedByPartition, error) {
	event := new(SecurityTokenRedeemedByPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "RedeemedByPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRelayHubChangedIterator is returned from FilterRelayHubChanged and is used to iterate over the raw logs and unpacked data for RelayHubChanged events raised by the SecurityToken contract.
type SecurityTokenRelayHubChangedIterator struct {
	Event *SecurityTokenRelayHubChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRelayHubChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRelayHubChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRelayHubChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRelayHubChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRelayHubChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRelayHubChanged represents a RelayHubChanged event raised by the SecurityToken contract.
type SecurityTokenRelayHubChanged struct {
	OldRelayHub common.Address
	NewRelayHub common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterRelayHubChanged is a free log retrieval operation binding the contract event 0xb9f84b8e65164b14439ae3620df0a4d8786d896996c0282b683f9d8c08f046e8.
//
// Solidity: event RelayHubChanged(address indexed oldRelayHub, address indexed newRelayHub)
func (_SecurityToken *SecurityTokenFilterer) FilterRelayHubChanged(opts *bind.FilterOpts, oldRelayHub []common.Address, newRelayHub []common.Address) (*SecurityTokenRelayHubChangedIterator, error) {

	var oldRelayHubRule []interface{}
	for _, oldRelayHubItem := range oldRelayHub {
		oldRelayHubRule = append(oldRelayHubRule, oldRelayHubItem)
	}
	var newRelayHubRule []interface{}
	for _, newRelayHubItem := range newRelayHub {
		newRelayHubRule = append(newRelayHubRule, newRelayHubItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RelayHubChanged", oldRelayHubRule, newRelayHubRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRelayHubChangedIterator{contract: _SecurityToken.contract, event: "RelayHubChanged", logs: logs, sub: sub}, nil
}

// WatchRelayHubChanged is a free log subscription operation binding the contract event 0xb9f84b8e65164b14439ae3620df0a4d8786d896996c0282b683f9d8c08f046e8.
//
// Solidity: event RelayHubChanged(address indexed oldRelayHub, address indexed newRelayHub)
func (_SecurityToken *SecurityTokenFilterer) WatchRelayHubChanged(opts *bind.WatchOpts, sink chan<- *SecurityTokenRelayHubChanged, oldRelayHub []common.Address, newRelayHub []common.Address) (event.Subscription, error) {

	var oldRelayHubRule []interface{}
	for _, oldRelayHubItem := range oldRelayHub {
		oldRelayHubRule = append(oldRelayHubRule, oldRelayHubItem)
	}
	var newRelayHubRule []interface{}
	for _, newRelayHubItem := range newRelayHub {
		newRelayHubRule = append(newRelayHubRule, newRelayHubItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RelayHubChanged", oldRelayHubRule, newRelayHubRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRelayHubChanged)
				if err := _SecurityToken.contract.UnpackLog(event, "RelayHubChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRelayHubChanged is a log parse operation binding the contract event 0xb9f84b8e65164b14439ae3620df0a4d8786d896996c0282b683f9d8c08f046e8.
//
// Solidity: event RelayHubChanged(address indexed oldRelayHub, address indexed newRelayHub)
func (_SecurityToken *SecurityTokenFilterer) ParseRelayHubChanged(log types.Log) (*SecurityTokenRelayHubChanged, error) {
	event := new(SecurityTokenRelayHubChanged)
	if err := _SecurityToken.contract.UnpackLog(event, "RelayHubChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRevokedOperatorIterator is returned from FilterRevokedOperator and is used to iterate over the raw logs and unpacked data for RevokedOperator events raised by the SecurityToken contract.
type SecurityTokenRevokedOperatorIterator struct {
	Event *SecurityTokenRevokedOperator // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRevokedOperatorIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRevokedOperator)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRevokedOperator)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRevokedOperatorIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRevokedOperatorIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRevokedOperator represents a RevokedOperator event raised by the SecurityToken contract.
type SecurityTokenRevokedOperator struct {
	Operator    common.Address
	TokenHolder common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterRevokedOperator is a free log retrieval operation binding the contract event 0x50546e66e5f44d728365dc3908c63bc5cfeeab470722c1677e3073a6ac294aa1.
//
// Solidity: event RevokedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) FilterRevokedOperator(opts *bind.FilterOpts, operator []common.Address, tokenHolder []common.Address) (*SecurityTokenRevokedOperatorIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RevokedOperator", operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRevokedOperatorIterator{contract: _SecurityToken.contract, event: "RevokedOperator", logs: logs, sub: sub}, nil
}

// WatchRevokedOperator is a free log subscription operation binding the contract event 0x50546e66e5f44d728365dc3908c63bc5cfeeab470722c1677e3073a6ac294aa1.
//
// Solidity: event RevokedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) WatchRevokedOperator(opts *bind.WatchOpts, sink chan<- *SecurityTokenRevokedOperator, operator []common.Address, tokenHolder []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RevokedOperator", operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRevokedOperator)
				if err := _SecurityToken.contract.UnpackLog(event, "RevokedOperator", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRevokedOperator is a log parse operation binding the contract event 0x50546e66e5f44d728365dc3908c63bc5cfeeab470722c1677e3073a6ac294aa1.
//
// Solidity: event RevokedOperator(address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) ParseRevokedOperator(log types.Log) (*SecurityTokenRevokedOperator, error) {
	event := new(SecurityTokenRevokedOperator)
	if err := _SecurityToken.contract.UnpackLog(event, "RevokedOperator", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRevokedOperatorByPartitionIterator is returned from FilterRevokedOperatorByPartition and is used to iterate over the raw logs and unpacked data for RevokedOperatorByPartition events raised by the SecurityToken contract.
type SecurityTokenRevokedOperatorByPartitionIterator struct {
	Event *SecurityTokenRevokedOperatorByPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRevokedOperatorByPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRevokedOperatorByPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRevokedOperatorByPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRevokedOperatorByPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRevokedOperatorByPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRevokedOperatorByPartition represents a RevokedOperatorByPartition event raised by the SecurityToken contract.
type SecurityTokenRevokedOperatorByPartition struct {
	Partition   [32]byte
	Operator    common.Address
	TokenHolder common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterRevokedOperatorByPartition is a free log retrieval operation binding the contract event 0x3b287c4f1bab4df949b33bceacef984f544dc5d5479930d00e4ee8c9d8dd96f2.
//
// Solidity: event RevokedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) FilterRevokedOperatorByPartition(opts *bind.FilterOpts, partition [][32]byte, operator []common.Address, tokenHolder []common.Address) (*SecurityTokenRevokedOperatorByPartitionIterator, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RevokedOperatorByPartition", partitionRule, operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRevokedOperatorByPartitionIterator{contract: _SecurityToken.contract, event: "RevokedOperatorByPartition", logs: logs, sub: sub}, nil
}

// WatchRevokedOperatorByPartition is a free log subscription operation binding the contract event 0x3b287c4f1bab4df949b33bceacef984f544dc5d5479930d00e4ee8c9d8dd96f2.
//
// Solidity: event RevokedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) WatchRevokedOperatorByPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenRevokedOperatorByPartition, partition [][32]byte, operator []common.Address, tokenHolder []common.Address) (event.Subscription, error) {

	var partitionRule []interface{}
	for _, partitionItem := range partition {
		partitionRule = append(partitionRule, partitionItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var tokenHolderRule []interface{}
	for _, tokenHolderItem := range tokenHolder {
		tokenHolderRule = append(tokenHolderRule, tokenHolderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RevokedOperatorByPartition", partitionRule, operatorRule, tokenHolderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRevokedOperatorByPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "RevokedOperatorByPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRevokedOperatorByPartition is a log parse operation binding the contract event 0x3b287c4f1bab4df949b33bceacef984f544dc5d5479930d00e4ee8c9d8dd96f2.
//
// Solidity: event RevokedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder)
func (_SecurityToken *SecurityTokenFilterer) ParseRevokedOperatorByPartition(log types.Log) (*SecurityTokenRevokedOperatorByPartition, error) {
	event := new(SecurityTokenRevokedOperatorByPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "RevokedOperatorByPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRoleGrantedIterator is returned from FilterRoleGranted and is used to iterate over the raw logs and unpacked data for RoleGranted events raised by the SecurityToken contract.
type SecurityTokenRoleGrantedIterator struct {
	Event *SecurityTokenRoleGranted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRoleGrantedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRoleGranted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRoleGranted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRoleGrantedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRoleGrantedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRoleGranted represents a RoleGranted event raised by the SecurityToken contract.
type SecurityTokenRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRoleGranted is a free log retrieval operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) FilterRoleGranted(opts *bind.FilterOpts, role [][32]byte, account []common.Address, sender []common.Address) (*SecurityTokenRoleGrantedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RoleGranted", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRoleGrantedIterator{contract: _SecurityToken.contract, event: "RoleGranted", logs: logs, sub: sub}, nil
}

// WatchRoleGranted is a free log subscription operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) WatchRoleGranted(opts *bind.WatchOpts, sink chan<- *SecurityTokenRoleGranted, role [][32]byte, account []common.Address, sender []common.Address) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RoleGranted", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRoleGranted)
				if err := _SecurityToken.contract.UnpackLog(event, "RoleGranted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleGranted is a log parse operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) ParseRoleGranted(log types.Log) (*SecurityTokenRoleGranted, error) {
	event := new(SecurityTokenRoleGranted)
	if err := _SecurityToken.contract.UnpackLog(event, "RoleGranted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRoleRenouncedIterator is returned from FilterRoleRenounced and is used to iterate over the raw logs and unpacked data for RoleRenounced events raised by the SecurityToken contract.
type SecurityTokenRoleRenouncedIterator struct {
	Event *SecurityTokenRoleRenounced // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRoleRenouncedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRoleRenounced)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRoleRenounced)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRoleRenouncedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRoleRenouncedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRoleRenounced represents a RoleRenounced event raised by the SecurityToken contract.
type SecurityTokenRoleRenounced struct {
	Role    [32]byte
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRoleRenounced is a free log retrieval operation binding the contract event 0x40b50f3eaf8f3571b1ca07ef86543a89b6aa4aa342739aa9f207f27303c6531f.
//
// Solidity: event RoleRenounced(bytes32 indexed role, address indexed account)
func (_SecurityToken *SecurityTokenFilterer) FilterRoleRenounced(opts *bind.FilterOpts, role [][32]byte, account []common.Address) (*SecurityTokenRoleRenouncedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RoleRenounced", roleRule, accountRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRoleRenouncedIterator{contract: _SecurityToken.contract, event: "RoleRenounced", logs: logs, sub: sub}, nil
}

// WatchRoleRenounced is a free log subscription operation binding the contract event 0x40b50f3eaf8f3571b1ca07ef86543a89b6aa4aa342739aa9f207f27303c6531f.
//
// Solidity: event RoleRenounced(bytes32 indexed role, address indexed account)
func (_SecurityToken *SecurityTokenFilterer) WatchRoleRenounced(opts *bind.WatchOpts, sink chan<- *SecurityTokenRoleRenounced, role [][32]byte, account []common.Address) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RoleRenounced", roleRule, accountRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRoleRenounced)
				if err := _SecurityToken.contract.UnpackLog(event, "RoleRenounced", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleRenounced is a log parse operation binding the contract event 0x40b50f3eaf8f3571b1ca07ef86543a89b6aa4aa342739aa9f207f27303c6531f.
//
// Solidity: event RoleRenounced(bytes32 indexed role, address indexed account)
func (_SecurityToken *SecurityTokenFilterer) ParseRoleRenounced(log types.Log) (*SecurityTokenRoleRenounced, error) {
	event := new(SecurityTokenRoleRenounced)
	if err := _SecurityToken.contract.UnpackLog(event, "RoleRenounced", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenRoleRevokedIterator is returned from FilterRoleRevoked and is used to iterate over the raw logs and unpacked data for RoleRevoked events raised by the SecurityToken contract.
type SecurityTokenRoleRevokedIterator struct {
	Event *SecurityTokenRoleRevoked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenRoleRevokedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenRoleRevoked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenRoleRevoked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenRoleRevokedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenRoleRevokedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenRoleRevoked represents a RoleRevoked event raised by the SecurityToken contract.
type SecurityTokenRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRoleRevoked is a free log retrieval operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) FilterRoleRevoked(opts *bind.FilterOpts, role [][32]byte, account []common.Address, sender []common.Address) (*SecurityTokenRoleRevokedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "RoleRevoked", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenRoleRevokedIterator{contract: _SecurityToken.contract, event: "RoleRevoked", logs: logs, sub: sub}, nil
}

// WatchRoleRevoked is a free log subscription operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) WatchRoleRevoked(opts *bind.WatchOpts, sink chan<- *SecurityTokenRoleRevoked, role [][32]byte, account []common.Address, sender []common.Address) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "RoleRevoked", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenRoleRevoked)
				if err := _SecurityToken.contract.UnpackLog(event, "RoleRevoked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleRevoked is a log parse operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_SecurityToken *SecurityTokenFilterer) ParseRoleRevoked(log types.Log) (*SecurityTokenRoleRevoked, error) {
	event := new(SecurityTokenRoleRevoked)
	if err := _SecurityToken.contract.UnpackLog(event, "RoleRevoked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the SecurityToken contract.
type SecurityTokenTransferIterator struct {
	Event *SecurityTokenTransfer // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenTransfer)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenTransfer)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenTransfer represents a Transfer event raised by the SecurityToken contract.
type SecurityTokenTransfer struct {
	From  common.Address
	To    common.Address
	Value *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address) (*SecurityTokenTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Transfer", fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenTransferIterator{contract: _SecurityToken.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *SecurityTokenTransfer, from []common.Address, to []common.Address) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Transfer", fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenTransfer)
				if err := _SecurityToken.contract.UnpackLog(event, "Transfer", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_SecurityToken *SecurityTokenFilterer) ParseTransfer(log types.Log) (*SecurityTokenTransfer, error) {
	event := new(SecurityTokenTransfer)
	if err := _SecurityToken.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenTransferByPartitionIterator is returned from FilterTransferByPartition and is used to iterate over the raw logs and unpacked data for TransferByPartition events raised by the SecurityToken contract.
type SecurityTokenTransferByPartitionIterator struct {
	Event *SecurityTokenTransferByPartition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenTransferByPartitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenTransferByPartition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenTransferByPartition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenTransferByPartitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenTransferByPartitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenTransferByPartition represents a TransferByPartition event raised by the SecurityToken contract.
type SecurityTokenTransferByPartition struct {
	FromPartition [32]byte
	Operator      common.Address
	From          common.Address
	To            common.Address
	Value         *big.Int
	Data          []byte
	OperatorData  []byte
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterTransferByPartition is a free log retrieval operation binding the contract event 0xff4e9a26af4eb73b8bacfaa4abd4fea03d9448e7b912dc5ff4019048875aa2d4.
//
// Solidity: event TransferByPartition(bytes32 indexed fromPartition, address operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterTransferByPartition(opts *bind.FilterOpts, fromPartition [][32]byte, from []common.Address, to []common.Address) (*SecurityTokenTransferByPartitionIterator, error) {

	var fromPartitionRule []interface{}
	for _, fromPartitionItem := range fromPartition {
		fromPartitionRule = append(fromPartitionRule, fromPartitionItem)
	}

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "TransferByPartition", fromPartitionRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenTransferByPartitionIterator{contract: _SecurityToken.contract, event: "TransferByPartition", logs: logs, sub: sub}, nil
}

// WatchTransferByPartition is a free log subscription operation binding the contract event 0xff4e9a26af4eb73b8bacfaa4abd4fea03d9448e7b912dc5ff4019048875aa2d4.
//
// Solidity: event TransferByPartition(bytes32 indexed fromPartition, address operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchTransferByPartition(opts *bind.WatchOpts, sink chan<- *SecurityTokenTransferByPartition, fromPartition [][32]byte, from []common.Address, to []common.Address) (event.Subscription, error) {

	var fromPartitionRule []interface{}
	for _, fromPartitionItem := range fromPartition {
		fromPartitionRule = append(fromPartitionRule, fromPartitionItem)
	}

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "TransferByPartition", fromPartitionRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenTransferByPartition)
				if err := _SecurityToken.contract.UnpackLog(event, "TransferByPartition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransferByPartition is a log parse operation binding the contract event 0xff4e9a26af4eb73b8bacfaa4abd4fea03d9448e7b912dc5ff4019048875aa2d4.
//
// Solidity: event TransferByPartition(bytes32 indexed fromPartition, address operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseTransferByPartition(log types.Log) (*SecurityTokenTransferByPartition, error) {
	event := new(SecurityTokenTransferByPartition)
	if err := _SecurityToken.contract.UnpackLog(event, "TransferByPartition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenTransferWithDataIterator is returned from FilterTransferWithData and is used to iterate over the raw logs and unpacked data for TransferWithData events raised by the SecurityToken contract.
type SecurityTokenTransferWithDataIterator struct {
	Event *SecurityTokenTransferWithData // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenTransferWithDataIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenTransferWithData)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenTransferWithData)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenTransferWithDataIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenTransferWithDataIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenTransferWithData represents a TransferWithData event raised by the SecurityToken contract.
type SecurityTokenTransferWithData struct {
	Operator     common.Address
	From         common.Address
	To           common.Address
	Value        *big.Int
	Data         []byte
	OperatorData []byte
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterTransferWithData is a free log retrieval operation binding the contract event 0xe8f0a47da72ca43153c7a5693a827aa8456f52633de9870a736e5605bff4af6d.
//
// Solidity: event TransferWithData(address indexed operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) FilterTransferWithData(opts *bind.FilterOpts, operator []common.Address, from []common.Address, to []common.Address) (*SecurityTokenTransferWithDataIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "TransferWithData", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenTransferWithDataIterator{contract: _SecurityToken.contract, event: "TransferWithData", logs: logs, sub: sub}, nil
}

// WatchTransferWithData is a free log subscription operation binding the contract event 0xe8f0a47da72ca43153c7a5693a827aa8456f52633de9870a736e5605bff4af6d.
//
// Solidity: event TransferWithData(address indexed operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) WatchTransferWithData(opts *bind.WatchOpts, sink chan<- *SecurityTokenTransferWithData, operator []common.Address, from []common.Address, to []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "TransferWithData", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenTransferWithData)
				if err := _SecurityToken.contract.UnpackLog(event, "TransferWithData", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransferWithData is a log parse operation binding the contract event 0xe8f0a47da72ca43153c7a5693a827aa8456f52633de9870a736e5605bff4af6d.
//
// Solidity: event TransferWithData(address indexed operator, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData)
func (_SecurityToken *SecurityTokenFilterer) ParseTransferWithData(log types.Log) (*SecurityTokenTransferWithData, error) {
	event := new(SecurityTokenTransferWithData)
	if err := _SecurityToken.contract.UnpackLog(event, "TransferWithData", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenUnpausedIterator is returned from FilterUnpaused and is used to iterate over the raw logs and unpacked data for Unpaused events raised by the SecurityToken contract.
type SecurityTokenUnpausedIterator struct {
	Event *SecurityTokenUnpaused // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SecurityTokenUnpausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenUnpaused)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SecurityTokenUnpaused)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SecurityTokenUnpausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenUnpausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenUnpaused represents a Unpaused event raised by the SecurityToken contract.
type SecurityTokenUnpaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnpaused is a free log retrieval operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_SecurityToken *SecurityTokenFilterer) FilterUnpaused(opts *bind.FilterOpts) (*SecurityTokenUnpausedIterator, error) {

	logs, sub, err := _SecurityToken.contract.FilterLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenUnpausedIterator{contract: _SecurityToken.contract, event: "Unpaused", logs: logs, sub: sub}, nil
}

// WatchUnpaused is a free log subscription operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_SecurityToken *SecurityTokenFilterer) WatchUnpaused(opts *bind.WatchOpts, sink chan<- *SecurityTokenUnpaused) (event.Subscription, error) {

	logs, sub, err := _SecurityToken.contract.WatchLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenUnpaused)
				if err := _SecurityToken.contract.UnpackLog(event, "Unpaused", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUnpaused is a log parse operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_SecurityToken *SecurityTokenFilterer) ParseUnpaused(log types.Log) (*SecurityTokenUnpaused, error) {
	event := new(SecurityTokenUnpaused)
	if err := _SecurityToken.contract.UnpackLog(event, "Unpaused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
