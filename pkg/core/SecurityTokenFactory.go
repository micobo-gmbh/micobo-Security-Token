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

// SecurityTokenFactoryMetaData contains all meta data concerning the SecurityTokenFactory contract.
var SecurityTokenFactoryMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_implementationContract\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"}],\"name\":\"ImplementationUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"ProxyCreated\",\"type\":\"event\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_salt\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_logic\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_admin\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"}],\"name\":\"deploy\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"_logic\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"}],\"name\":\"deployMinimal\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_salt\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_logic\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_admin\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"_signature\",\"type\":\"bytes\"}],\"name\":\"deploySigned\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_salt\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_sender\",\"type\":\"address\"}],\"name\":\"getDeploymentAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_salt\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_logic\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_admin\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"_signature\",\"type\":\"bytes\"}],\"name\":\"getSigner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"implementationContract\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"isOwner\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"_implementationContract\",\"type\":\"address\"}],\"name\":\"updateImplementation\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_salt\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_admin\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"}],\"name\":\"deployNewSecurityToken\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// SecurityTokenFactoryABI is the input ABI used to generate the binding from.
// Deprecated: Use SecurityTokenFactoryMetaData.ABI instead.
var SecurityTokenFactoryABI = SecurityTokenFactoryMetaData.ABI

// SecurityTokenFactory is an auto generated Go binding around an Ethereum contract.
type SecurityTokenFactory struct {
	SecurityTokenFactoryCaller     // Read-only binding to the contract
	SecurityTokenFactoryTransactor // Write-only binding to the contract
	SecurityTokenFactoryFilterer   // Log filterer for contract events
}

// SecurityTokenFactoryCaller is an auto generated read-only Go binding around an Ethereum contract.
type SecurityTokenFactoryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenFactoryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type SecurityTokenFactoryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenFactoryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type SecurityTokenFactoryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SecurityTokenFactorySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type SecurityTokenFactorySession struct {
	Contract     *SecurityTokenFactory // Generic contract binding to set the session for
	CallOpts     bind.CallOpts         // Call options to use throughout this session
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// SecurityTokenFactoryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type SecurityTokenFactoryCallerSession struct {
	Contract *SecurityTokenFactoryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts               // Call options to use throughout this session
}

// SecurityTokenFactoryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type SecurityTokenFactoryTransactorSession struct {
	Contract     *SecurityTokenFactoryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts               // Transaction auth options to use throughout this session
}

// SecurityTokenFactoryRaw is an auto generated low-level Go binding around an Ethereum contract.
type SecurityTokenFactoryRaw struct {
	Contract *SecurityTokenFactory // Generic contract binding to access the raw methods on
}

// SecurityTokenFactoryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type SecurityTokenFactoryCallerRaw struct {
	Contract *SecurityTokenFactoryCaller // Generic read-only contract binding to access the raw methods on
}

// SecurityTokenFactoryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type SecurityTokenFactoryTransactorRaw struct {
	Contract *SecurityTokenFactoryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewSecurityTokenFactory creates a new instance of SecurityTokenFactory, bound to a specific deployed contract.
func NewSecurityTokenFactory(address common.Address, backend bind.ContractBackend) (*SecurityTokenFactory, error) {
	contract, err := bindSecurityTokenFactory(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactory{SecurityTokenFactoryCaller: SecurityTokenFactoryCaller{contract: contract}, SecurityTokenFactoryTransactor: SecurityTokenFactoryTransactor{contract: contract}, SecurityTokenFactoryFilterer: SecurityTokenFactoryFilterer{contract: contract}}, nil
}

// NewSecurityTokenFactoryCaller creates a new read-only instance of SecurityTokenFactory, bound to a specific deployed contract.
func NewSecurityTokenFactoryCaller(address common.Address, caller bind.ContractCaller) (*SecurityTokenFactoryCaller, error) {
	contract, err := bindSecurityTokenFactory(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryCaller{contract: contract}, nil
}

// NewSecurityTokenFactoryTransactor creates a new write-only instance of SecurityTokenFactory, bound to a specific deployed contract.
func NewSecurityTokenFactoryTransactor(address common.Address, transactor bind.ContractTransactor) (*SecurityTokenFactoryTransactor, error) {
	contract, err := bindSecurityTokenFactory(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryTransactor{contract: contract}, nil
}

// NewSecurityTokenFactoryFilterer creates a new log filterer instance of SecurityTokenFactory, bound to a specific deployed contract.
func NewSecurityTokenFactoryFilterer(address common.Address, filterer bind.ContractFilterer) (*SecurityTokenFactoryFilterer, error) {
	contract, err := bindSecurityTokenFactory(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryFilterer{contract: contract}, nil
}

// bindSecurityTokenFactory binds a generic wrapper to an already deployed contract.
func bindSecurityTokenFactory(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(SecurityTokenFactoryABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SecurityTokenFactory *SecurityTokenFactoryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SecurityTokenFactory.Contract.SecurityTokenFactoryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SecurityTokenFactory *SecurityTokenFactoryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.SecurityTokenFactoryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SecurityTokenFactory *SecurityTokenFactoryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.SecurityTokenFactoryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SecurityTokenFactory *SecurityTokenFactoryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SecurityTokenFactory.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.contract.Transact(opts, method, params...)
}

// GetDeploymentAddress is a free data retrieval call binding the contract method 0x81ae1f5b.
//
// Solidity: function getDeploymentAddress(uint256 _salt, address _sender) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCaller) GetDeploymentAddress(opts *bind.CallOpts, _salt *big.Int, _sender common.Address) (common.Address, error) {
	var out []interface{}
	err := _SecurityTokenFactory.contract.Call(opts, &out, "getDeploymentAddress", _salt, _sender)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetDeploymentAddress is a free data retrieval call binding the contract method 0x81ae1f5b.
//
// Solidity: function getDeploymentAddress(uint256 _salt, address _sender) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) GetDeploymentAddress(_salt *big.Int, _sender common.Address) (common.Address, error) {
	return _SecurityTokenFactory.Contract.GetDeploymentAddress(&_SecurityTokenFactory.CallOpts, _salt, _sender)
}

// GetDeploymentAddress is a free data retrieval call binding the contract method 0x81ae1f5b.
//
// Solidity: function getDeploymentAddress(uint256 _salt, address _sender) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCallerSession) GetDeploymentAddress(_salt *big.Int, _sender common.Address) (common.Address, error) {
	return _SecurityTokenFactory.Contract.GetDeploymentAddress(&_SecurityTokenFactory.CallOpts, _salt, _sender)
}

// GetSigner is a free data retrieval call binding the contract method 0x290f8f56.
//
// Solidity: function getSigner(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCaller) GetSigner(opts *bind.CallOpts, _salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (common.Address, error) {
	var out []interface{}
	err := _SecurityTokenFactory.contract.Call(opts, &out, "getSigner", _salt, _logic, _admin, _data, _signature)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetSigner is a free data retrieval call binding the contract method 0x290f8f56.
//
// Solidity: function getSigner(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) GetSigner(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (common.Address, error) {
	return _SecurityTokenFactory.Contract.GetSigner(&_SecurityTokenFactory.CallOpts, _salt, _logic, _admin, _data, _signature)
}

// GetSigner is a free data retrieval call binding the contract method 0x290f8f56.
//
// Solidity: function getSigner(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCallerSession) GetSigner(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (common.Address, error) {
	return _SecurityTokenFactory.Contract.GetSigner(&_SecurityTokenFactory.CallOpts, _salt, _logic, _admin, _data, _signature)
}

// ImplementationContract is a free data retrieval call binding the contract method 0x99e7d056.
//
// Solidity: function implementationContract() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCaller) ImplementationContract(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SecurityTokenFactory.contract.Call(opts, &out, "implementationContract")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// ImplementationContract is a free data retrieval call binding the contract method 0x99e7d056.
//
// Solidity: function implementationContract() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) ImplementationContract() (common.Address, error) {
	return _SecurityTokenFactory.Contract.ImplementationContract(&_SecurityTokenFactory.CallOpts)
}

// ImplementationContract is a free data retrieval call binding the contract method 0x99e7d056.
//
// Solidity: function implementationContract() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCallerSession) ImplementationContract() (common.Address, error) {
	return _SecurityTokenFactory.Contract.ImplementationContract(&_SecurityTokenFactory.CallOpts)
}

// IsOwner is a free data retrieval call binding the contract method 0x8f32d59b.
//
// Solidity: function isOwner() view returns(bool)
func (_SecurityTokenFactory *SecurityTokenFactoryCaller) IsOwner(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _SecurityTokenFactory.contract.Call(opts, &out, "isOwner")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsOwner is a free data retrieval call binding the contract method 0x8f32d59b.
//
// Solidity: function isOwner() view returns(bool)
func (_SecurityTokenFactory *SecurityTokenFactorySession) IsOwner() (bool, error) {
	return _SecurityTokenFactory.Contract.IsOwner(&_SecurityTokenFactory.CallOpts)
}

// IsOwner is a free data retrieval call binding the contract method 0x8f32d59b.
//
// Solidity: function isOwner() view returns(bool)
func (_SecurityTokenFactory *SecurityTokenFactoryCallerSession) IsOwner() (bool, error) {
	return _SecurityTokenFactory.Contract.IsOwner(&_SecurityTokenFactory.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SecurityTokenFactory.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) Owner() (common.Address, error) {
	return _SecurityTokenFactory.Contract.Owner(&_SecurityTokenFactory.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryCallerSession) Owner() (common.Address, error) {
	return _SecurityTokenFactory.Contract.Owner(&_SecurityTokenFactory.CallOpts)
}

// Deploy is a paid mutator transaction binding the contract method 0x6150864c.
//
// Solidity: function deploy(uint256 _salt, address _logic, address _admin, bytes _data) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) Deploy(opts *bind.TransactOpts, _salt *big.Int, _logic common.Address, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "deploy", _salt, _logic, _admin, _data)
}

// Deploy is a paid mutator transaction binding the contract method 0x6150864c.
//
// Solidity: function deploy(uint256 _salt, address _logic, address _admin, bytes _data) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) Deploy(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.Deploy(&_SecurityTokenFactory.TransactOpts, _salt, _logic, _admin, _data)
}

// Deploy is a paid mutator transaction binding the contract method 0x6150864c.
//
// Solidity: function deploy(uint256 _salt, address _logic, address _admin, bytes _data) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) Deploy(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.Deploy(&_SecurityTokenFactory.TransactOpts, _salt, _logic, _admin, _data)
}

// DeployMinimal is a paid mutator transaction binding the contract method 0xb3eeb5e2.
//
// Solidity: function deployMinimal(address _logic, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) DeployMinimal(opts *bind.TransactOpts, _logic common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "deployMinimal", _logic, _data)
}

// DeployMinimal is a paid mutator transaction binding the contract method 0xb3eeb5e2.
//
// Solidity: function deployMinimal(address _logic, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactorySession) DeployMinimal(_logic common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeployMinimal(&_SecurityTokenFactory.TransactOpts, _logic, _data)
}

// DeployMinimal is a paid mutator transaction binding the contract method 0xb3eeb5e2.
//
// Solidity: function deployMinimal(address _logic, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) DeployMinimal(_logic common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeployMinimal(&_SecurityTokenFactory.TransactOpts, _logic, _data)
}

// DeployNewSecurityToken is a paid mutator transaction binding the contract method 0x83966b22.
//
// Solidity: function deployNewSecurityToken(uint256 _salt, address _admin, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) DeployNewSecurityToken(opts *bind.TransactOpts, _salt *big.Int, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "deployNewSecurityToken", _salt, _admin, _data)
}

// DeployNewSecurityToken is a paid mutator transaction binding the contract method 0x83966b22.
//
// Solidity: function deployNewSecurityToken(uint256 _salt, address _admin, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactorySession) DeployNewSecurityToken(_salt *big.Int, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeployNewSecurityToken(&_SecurityTokenFactory.TransactOpts, _salt, _admin, _data)
}

// DeployNewSecurityToken is a paid mutator transaction binding the contract method 0x83966b22.
//
// Solidity: function deployNewSecurityToken(uint256 _salt, address _admin, bytes _data) returns(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) DeployNewSecurityToken(_salt *big.Int, _admin common.Address, _data []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeployNewSecurityToken(&_SecurityTokenFactory.TransactOpts, _salt, _admin, _data)
}

// DeploySigned is a paid mutator transaction binding the contract method 0x332d6626.
//
// Solidity: function deploySigned(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) DeploySigned(opts *bind.TransactOpts, _salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "deploySigned", _salt, _logic, _admin, _data, _signature)
}

// DeploySigned is a paid mutator transaction binding the contract method 0x332d6626.
//
// Solidity: function deploySigned(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactorySession) DeploySigned(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeploySigned(&_SecurityTokenFactory.TransactOpts, _salt, _logic, _admin, _data, _signature)
}

// DeploySigned is a paid mutator transaction binding the contract method 0x332d6626.
//
// Solidity: function deploySigned(uint256 _salt, address _logic, address _admin, bytes _data, bytes _signature) returns(address)
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) DeploySigned(_salt *big.Int, _logic common.Address, _admin common.Address, _data []byte, _signature []byte) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.DeploySigned(&_SecurityTokenFactory.TransactOpts, _salt, _logic, _admin, _data, _signature)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SecurityTokenFactory *SecurityTokenFactorySession) RenounceOwnership() (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.RenounceOwnership(&_SecurityTokenFactory.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.RenounceOwnership(&_SecurityTokenFactory.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityTokenFactory *SecurityTokenFactorySession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.TransferOwnership(&_SecurityTokenFactory.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.TransferOwnership(&_SecurityTokenFactory.TransactOpts, newOwner)
}

// UpdateImplementation is a paid mutator transaction binding the contract method 0x025b22bc.
//
// Solidity: function updateImplementation(address _implementationContract) returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactor) UpdateImplementation(opts *bind.TransactOpts, _implementationContract common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.contract.Transact(opts, "updateImplementation", _implementationContract)
}

// UpdateImplementation is a paid mutator transaction binding the contract method 0x025b22bc.
//
// Solidity: function updateImplementation(address _implementationContract) returns()
func (_SecurityTokenFactory *SecurityTokenFactorySession) UpdateImplementation(_implementationContract common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.UpdateImplementation(&_SecurityTokenFactory.TransactOpts, _implementationContract)
}

// UpdateImplementation is a paid mutator transaction binding the contract method 0x025b22bc.
//
// Solidity: function updateImplementation(address _implementationContract) returns()
func (_SecurityTokenFactory *SecurityTokenFactoryTransactorSession) UpdateImplementation(_implementationContract common.Address) (*types.Transaction, error) {
	return _SecurityTokenFactory.Contract.UpdateImplementation(&_SecurityTokenFactory.TransactOpts, _implementationContract)
}

// SecurityTokenFactoryImplementationUpdatedIterator is returned from FilterImplementationUpdated and is used to iterate over the raw logs and unpacked data for ImplementationUpdated events raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryImplementationUpdatedIterator struct {
	Event *SecurityTokenFactoryImplementationUpdated // Event containing the contract specifics and raw log

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
func (it *SecurityTokenFactoryImplementationUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenFactoryImplementationUpdated)
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
		it.Event = new(SecurityTokenFactoryImplementationUpdated)
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
func (it *SecurityTokenFactoryImplementationUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenFactoryImplementationUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenFactoryImplementationUpdated represents a ImplementationUpdated event raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryImplementationUpdated struct {
	NewImplementation common.Address
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterImplementationUpdated is a free log retrieval operation binding the contract event 0x310ba5f1d2ed074b51e2eccd052a47ae9ab7c6b800d1fca3db3999d6a592ca03.
//
// Solidity: event ImplementationUpdated(address indexed newImplementation)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) FilterImplementationUpdated(opts *bind.FilterOpts, newImplementation []common.Address) (*SecurityTokenFactoryImplementationUpdatedIterator, error) {

	var newImplementationRule []interface{}
	for _, newImplementationItem := range newImplementation {
		newImplementationRule = append(newImplementationRule, newImplementationItem)
	}

	logs, sub, err := _SecurityTokenFactory.contract.FilterLogs(opts, "ImplementationUpdated", newImplementationRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryImplementationUpdatedIterator{contract: _SecurityTokenFactory.contract, event: "ImplementationUpdated", logs: logs, sub: sub}, nil
}

// WatchImplementationUpdated is a free log subscription operation binding the contract event 0x310ba5f1d2ed074b51e2eccd052a47ae9ab7c6b800d1fca3db3999d6a592ca03.
//
// Solidity: event ImplementationUpdated(address indexed newImplementation)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) WatchImplementationUpdated(opts *bind.WatchOpts, sink chan<- *SecurityTokenFactoryImplementationUpdated, newImplementation []common.Address) (event.Subscription, error) {

	var newImplementationRule []interface{}
	for _, newImplementationItem := range newImplementation {
		newImplementationRule = append(newImplementationRule, newImplementationItem)
	}

	logs, sub, err := _SecurityTokenFactory.contract.WatchLogs(opts, "ImplementationUpdated", newImplementationRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenFactoryImplementationUpdated)
				if err := _SecurityTokenFactory.contract.UnpackLog(event, "ImplementationUpdated", log); err != nil {
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

// ParseImplementationUpdated is a log parse operation binding the contract event 0x310ba5f1d2ed074b51e2eccd052a47ae9ab7c6b800d1fca3db3999d6a592ca03.
//
// Solidity: event ImplementationUpdated(address indexed newImplementation)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) ParseImplementationUpdated(log types.Log) (*SecurityTokenFactoryImplementationUpdated, error) {
	event := new(SecurityTokenFactoryImplementationUpdated)
	if err := _SecurityTokenFactory.contract.UnpackLog(event, "ImplementationUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenFactoryOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryOwnershipTransferredIterator struct {
	Event *SecurityTokenFactoryOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *SecurityTokenFactoryOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenFactoryOwnershipTransferred)
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
		it.Event = new(SecurityTokenFactoryOwnershipTransferred)
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
func (it *SecurityTokenFactoryOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenFactoryOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenFactoryOwnershipTransferred represents a OwnershipTransferred event raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*SecurityTokenFactoryOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SecurityTokenFactory.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryOwnershipTransferredIterator{contract: _SecurityTokenFactory.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *SecurityTokenFactoryOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SecurityTokenFactory.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenFactoryOwnershipTransferred)
				if err := _SecurityTokenFactory.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) ParseOwnershipTransferred(log types.Log) (*SecurityTokenFactoryOwnershipTransferred, error) {
	event := new(SecurityTokenFactoryOwnershipTransferred)
	if err := _SecurityTokenFactory.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SecurityTokenFactoryProxyCreatedIterator is returned from FilterProxyCreated and is used to iterate over the raw logs and unpacked data for ProxyCreated events raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryProxyCreatedIterator struct {
	Event *SecurityTokenFactoryProxyCreated // Event containing the contract specifics and raw log

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
func (it *SecurityTokenFactoryProxyCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SecurityTokenFactoryProxyCreated)
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
		it.Event = new(SecurityTokenFactoryProxyCreated)
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
func (it *SecurityTokenFactoryProxyCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SecurityTokenFactoryProxyCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SecurityTokenFactoryProxyCreated represents a ProxyCreated event raised by the SecurityTokenFactory contract.
type SecurityTokenFactoryProxyCreated struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterProxyCreated is a free log retrieval operation binding the contract event 0x00fffc2da0b561cae30d9826d37709e9421c4725faebc226cbbb7ef5fc5e7349.
//
// Solidity: event ProxyCreated(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) FilterProxyCreated(opts *bind.FilterOpts) (*SecurityTokenFactoryProxyCreatedIterator, error) {

	logs, sub, err := _SecurityTokenFactory.contract.FilterLogs(opts, "ProxyCreated")
	if err != nil {
		return nil, err
	}
	return &SecurityTokenFactoryProxyCreatedIterator{contract: _SecurityTokenFactory.contract, event: "ProxyCreated", logs: logs, sub: sub}, nil
}

// WatchProxyCreated is a free log subscription operation binding the contract event 0x00fffc2da0b561cae30d9826d37709e9421c4725faebc226cbbb7ef5fc5e7349.
//
// Solidity: event ProxyCreated(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) WatchProxyCreated(opts *bind.WatchOpts, sink chan<- *SecurityTokenFactoryProxyCreated) (event.Subscription, error) {

	logs, sub, err := _SecurityTokenFactory.contract.WatchLogs(opts, "ProxyCreated")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SecurityTokenFactoryProxyCreated)
				if err := _SecurityTokenFactory.contract.UnpackLog(event, "ProxyCreated", log); err != nil {
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

// ParseProxyCreated is a log parse operation binding the contract event 0x00fffc2da0b561cae30d9826d37709e9421c4725faebc226cbbb7ef5fc5e7349.
//
// Solidity: event ProxyCreated(address proxy)
func (_SecurityTokenFactory *SecurityTokenFactoryFilterer) ParseProxyCreated(log types.Log) (*SecurityTokenFactoryProxyCreated, error) {
	event := new(SecurityTokenFactoryProxyCreated)
	if err := _SecurityTokenFactory.contract.UnpackLog(event, "ProxyCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
