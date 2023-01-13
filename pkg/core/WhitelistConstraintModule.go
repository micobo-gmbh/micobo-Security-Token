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

// WhitelistConstraintModuleMetaData contains all meta data concerning the WhitelistConstraintModule contract.
var WhitelistConstraintModuleMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tokenAddress\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"whitelisted\",\"type\":\"bool\"}],\"name\":\"WhitelistEdit\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isWhitelisted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"whitelisted\",\"type\":\"bool\"}],\"name\":\"editWhitelist\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"accounts\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"whitelisted\",\"type\":\"bool\"}],\"name\":\"bulkEditWhitelist\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"executeTransfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getModuleName\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// WhitelistConstraintModuleABI is the input ABI used to generate the binding from.
// Deprecated: Use WhitelistConstraintModuleMetaData.ABI instead.
var WhitelistConstraintModuleABI = WhitelistConstraintModuleMetaData.ABI

// WhitelistConstraintModule is an auto generated Go binding around an Ethereum contract.
type WhitelistConstraintModule struct {
	WhitelistConstraintModuleCaller     // Read-only binding to the contract
	WhitelistConstraintModuleTransactor // Write-only binding to the contract
	WhitelistConstraintModuleFilterer   // Log filterer for contract events
}

// WhitelistConstraintModuleCaller is an auto generated read-only Go binding around an Ethereum contract.
type WhitelistConstraintModuleCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// WhitelistConstraintModuleTransactor is an auto generated write-only Go binding around an Ethereum contract.
type WhitelistConstraintModuleTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// WhitelistConstraintModuleFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type WhitelistConstraintModuleFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// WhitelistConstraintModuleSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type WhitelistConstraintModuleSession struct {
	Contract     *WhitelistConstraintModule // Generic contract binding to set the session for
	CallOpts     bind.CallOpts              // Call options to use throughout this session
	TransactOpts bind.TransactOpts          // Transaction auth options to use throughout this session
}

// WhitelistConstraintModuleCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type WhitelistConstraintModuleCallerSession struct {
	Contract *WhitelistConstraintModuleCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                    // Call options to use throughout this session
}

// WhitelistConstraintModuleTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type WhitelistConstraintModuleTransactorSession struct {
	Contract     *WhitelistConstraintModuleTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                    // Transaction auth options to use throughout this session
}

// WhitelistConstraintModuleRaw is an auto generated low-level Go binding around an Ethereum contract.
type WhitelistConstraintModuleRaw struct {
	Contract *WhitelistConstraintModule // Generic contract binding to access the raw methods on
}

// WhitelistConstraintModuleCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type WhitelistConstraintModuleCallerRaw struct {
	Contract *WhitelistConstraintModuleCaller // Generic read-only contract binding to access the raw methods on
}

// WhitelistConstraintModuleTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type WhitelistConstraintModuleTransactorRaw struct {
	Contract *WhitelistConstraintModuleTransactor // Generic write-only contract binding to access the raw methods on
}

// NewWhitelistConstraintModule creates a new instance of WhitelistConstraintModule, bound to a specific deployed contract.
func NewWhitelistConstraintModule(address common.Address, backend bind.ContractBackend) (*WhitelistConstraintModule, error) {
	contract, err := bindWhitelistConstraintModule(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &WhitelistConstraintModule{WhitelistConstraintModuleCaller: WhitelistConstraintModuleCaller{contract: contract}, WhitelistConstraintModuleTransactor: WhitelistConstraintModuleTransactor{contract: contract}, WhitelistConstraintModuleFilterer: WhitelistConstraintModuleFilterer{contract: contract}}, nil
}

// NewWhitelistConstraintModuleCaller creates a new read-only instance of WhitelistConstraintModule, bound to a specific deployed contract.
func NewWhitelistConstraintModuleCaller(address common.Address, caller bind.ContractCaller) (*WhitelistConstraintModuleCaller, error) {
	contract, err := bindWhitelistConstraintModule(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &WhitelistConstraintModuleCaller{contract: contract}, nil
}

// NewWhitelistConstraintModuleTransactor creates a new write-only instance of WhitelistConstraintModule, bound to a specific deployed contract.
func NewWhitelistConstraintModuleTransactor(address common.Address, transactor bind.ContractTransactor) (*WhitelistConstraintModuleTransactor, error) {
	contract, err := bindWhitelistConstraintModule(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &WhitelistConstraintModuleTransactor{contract: contract}, nil
}

// NewWhitelistConstraintModuleFilterer creates a new log filterer instance of WhitelistConstraintModule, bound to a specific deployed contract.
func NewWhitelistConstraintModuleFilterer(address common.Address, filterer bind.ContractFilterer) (*WhitelistConstraintModuleFilterer, error) {
	contract, err := bindWhitelistConstraintModule(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &WhitelistConstraintModuleFilterer{contract: contract}, nil
}

// bindWhitelistConstraintModule binds a generic wrapper to an already deployed contract.
func bindWhitelistConstraintModule(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(WhitelistConstraintModuleABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_WhitelistConstraintModule *WhitelistConstraintModuleRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _WhitelistConstraintModule.Contract.WhitelistConstraintModuleCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_WhitelistConstraintModule *WhitelistConstraintModuleRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.WhitelistConstraintModuleTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_WhitelistConstraintModule *WhitelistConstraintModuleRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.WhitelistConstraintModuleTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_WhitelistConstraintModule *WhitelistConstraintModuleCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _WhitelistConstraintModule.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.contract.Transact(opts, method, params...)
}

// GetModuleName is a free data retrieval call binding the contract method 0x8571a13e.
//
// Solidity: function getModuleName() view returns(bytes32)
func (_WhitelistConstraintModule *WhitelistConstraintModuleCaller) GetModuleName(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _WhitelistConstraintModule.contract.Call(opts, &out, "getModuleName")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// GetModuleName is a free data retrieval call binding the contract method 0x8571a13e.
//
// Solidity: function getModuleName() view returns(bytes32)
func (_WhitelistConstraintModule *WhitelistConstraintModuleSession) GetModuleName() ([32]byte, error) {
	return _WhitelistConstraintModule.Contract.GetModuleName(&_WhitelistConstraintModule.CallOpts)
}

// GetModuleName is a free data retrieval call binding the contract method 0x8571a13e.
//
// Solidity: function getModuleName() view returns(bytes32)
func (_WhitelistConstraintModule *WhitelistConstraintModuleCallerSession) GetModuleName() ([32]byte, error) {
	return _WhitelistConstraintModule.Contract.GetModuleName(&_WhitelistConstraintModule.CallOpts)
}

// IsWhitelisted is a free data retrieval call binding the contract method 0x3af32abf.
//
// Solidity: function isWhitelisted(address account) view returns(bool)
func (_WhitelistConstraintModule *WhitelistConstraintModuleCaller) IsWhitelisted(opts *bind.CallOpts, account common.Address) (bool, error) {
	var out []interface{}
	err := _WhitelistConstraintModule.contract.Call(opts, &out, "isWhitelisted", account)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsWhitelisted is a free data retrieval call binding the contract method 0x3af32abf.
//
// Solidity: function isWhitelisted(address account) view returns(bool)
func (_WhitelistConstraintModule *WhitelistConstraintModuleSession) IsWhitelisted(account common.Address) (bool, error) {
	return _WhitelistConstraintModule.Contract.IsWhitelisted(&_WhitelistConstraintModule.CallOpts, account)
}

// IsWhitelisted is a free data retrieval call binding the contract method 0x3af32abf.
//
// Solidity: function isWhitelisted(address account) view returns(bool)
func (_WhitelistConstraintModule *WhitelistConstraintModuleCallerSession) IsWhitelisted(account common.Address) (bool, error) {
	return _WhitelistConstraintModule.Contract.IsWhitelisted(&_WhitelistConstraintModule.CallOpts, account)
}

// BulkEditWhitelist is a paid mutator transaction binding the contract method 0xc26f8e22.
//
// Solidity: function bulkEditWhitelist(address[] accounts, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactor) BulkEditWhitelist(opts *bind.TransactOpts, accounts []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.contract.Transact(opts, "bulkEditWhitelist", accounts, whitelisted)
}

// BulkEditWhitelist is a paid mutator transaction binding the contract method 0xc26f8e22.
//
// Solidity: function bulkEditWhitelist(address[] accounts, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleSession) BulkEditWhitelist(accounts []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.BulkEditWhitelist(&_WhitelistConstraintModule.TransactOpts, accounts, whitelisted)
}

// BulkEditWhitelist is a paid mutator transaction binding the contract method 0xc26f8e22.
//
// Solidity: function bulkEditWhitelist(address[] accounts, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactorSession) BulkEditWhitelist(accounts []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.BulkEditWhitelist(&_WhitelistConstraintModule.TransactOpts, accounts, whitelisted)
}

// EditWhitelist is a paid mutator transaction binding the contract method 0x88cb214e.
//
// Solidity: function editWhitelist(address account, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactor) EditWhitelist(opts *bind.TransactOpts, account common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.contract.Transact(opts, "editWhitelist", account, whitelisted)
}

// EditWhitelist is a paid mutator transaction binding the contract method 0x88cb214e.
//
// Solidity: function editWhitelist(address account, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleSession) EditWhitelist(account common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.EditWhitelist(&_WhitelistConstraintModule.TransactOpts, account, whitelisted)
}

// EditWhitelist is a paid mutator transaction binding the contract method 0x88cb214e.
//
// Solidity: function editWhitelist(address account, bool whitelisted) returns()
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactorSession) EditWhitelist(account common.Address, whitelisted bool) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.EditWhitelist(&_WhitelistConstraintModule.TransactOpts, account, whitelisted)
}

// ExecuteTransfer is a paid mutator transaction binding the contract method 0x8608ee35.
//
// Solidity: function executeTransfer(address , bytes32 , address , address from, address to, uint256 , bytes , bytes ) returns(bool, string)
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactor) ExecuteTransfer(opts *bind.TransactOpts, arg0 common.Address, arg1 [32]byte, arg2 common.Address, from common.Address, to common.Address, arg5 *big.Int, arg6 []byte, arg7 []byte) (*types.Transaction, error) {
	return _WhitelistConstraintModule.contract.Transact(opts, "executeTransfer", arg0, arg1, arg2, from, to, arg5, arg6, arg7)
}

// ExecuteTransfer is a paid mutator transaction binding the contract method 0x8608ee35.
//
// Solidity: function executeTransfer(address , bytes32 , address , address from, address to, uint256 , bytes , bytes ) returns(bool, string)
func (_WhitelistConstraintModule *WhitelistConstraintModuleSession) ExecuteTransfer(arg0 common.Address, arg1 [32]byte, arg2 common.Address, from common.Address, to common.Address, arg5 *big.Int, arg6 []byte, arg7 []byte) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.ExecuteTransfer(&_WhitelistConstraintModule.TransactOpts, arg0, arg1, arg2, from, to, arg5, arg6, arg7)
}

// ExecuteTransfer is a paid mutator transaction binding the contract method 0x8608ee35.
//
// Solidity: function executeTransfer(address , bytes32 , address , address from, address to, uint256 , bytes , bytes ) returns(bool, string)
func (_WhitelistConstraintModule *WhitelistConstraintModuleTransactorSession) ExecuteTransfer(arg0 common.Address, arg1 [32]byte, arg2 common.Address, from common.Address, to common.Address, arg5 *big.Int, arg6 []byte, arg7 []byte) (*types.Transaction, error) {
	return _WhitelistConstraintModule.Contract.ExecuteTransfer(&_WhitelistConstraintModule.TransactOpts, arg0, arg1, arg2, from, to, arg5, arg6, arg7)
}

// WhitelistConstraintModuleWhitelistEditIterator is returned from FilterWhitelistEdit and is used to iterate over the raw logs and unpacked data for WhitelistEdit events raised by the WhitelistConstraintModule contract.
type WhitelistConstraintModuleWhitelistEditIterator struct {
	Event *WhitelistConstraintModuleWhitelistEdit // Event containing the contract specifics and raw log

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
func (it *WhitelistConstraintModuleWhitelistEditIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(WhitelistConstraintModuleWhitelistEdit)
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
		it.Event = new(WhitelistConstraintModuleWhitelistEdit)
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
func (it *WhitelistConstraintModuleWhitelistEditIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *WhitelistConstraintModuleWhitelistEditIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// WhitelistConstraintModuleWhitelistEdit represents a WhitelistEdit event raised by the WhitelistConstraintModule contract.
type WhitelistConstraintModuleWhitelistEdit struct {
	Account     common.Address
	Whitelisted bool
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterWhitelistEdit is a free log retrieval operation binding the contract event 0x67652629ee6670392739cc4dfdd74c00b3f827d485878c85a1358995f8eb35cb.
//
// Solidity: event WhitelistEdit(address account, bool whitelisted)
func (_WhitelistConstraintModule *WhitelistConstraintModuleFilterer) FilterWhitelistEdit(opts *bind.FilterOpts) (*WhitelistConstraintModuleWhitelistEditIterator, error) {

	logs, sub, err := _WhitelistConstraintModule.contract.FilterLogs(opts, "WhitelistEdit")
	if err != nil {
		return nil, err
	}
	return &WhitelistConstraintModuleWhitelistEditIterator{contract: _WhitelistConstraintModule.contract, event: "WhitelistEdit", logs: logs, sub: sub}, nil
}

// WatchWhitelistEdit is a free log subscription operation binding the contract event 0x67652629ee6670392739cc4dfdd74c00b3f827d485878c85a1358995f8eb35cb.
//
// Solidity: event WhitelistEdit(address account, bool whitelisted)
func (_WhitelistConstraintModule *WhitelistConstraintModuleFilterer) WatchWhitelistEdit(opts *bind.WatchOpts, sink chan<- *WhitelistConstraintModuleWhitelistEdit) (event.Subscription, error) {

	logs, sub, err := _WhitelistConstraintModule.contract.WatchLogs(opts, "WhitelistEdit")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(WhitelistConstraintModuleWhitelistEdit)
				if err := _WhitelistConstraintModule.contract.UnpackLog(event, "WhitelistEdit", log); err != nil {
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

// ParseWhitelistEdit is a log parse operation binding the contract event 0x67652629ee6670392739cc4dfdd74c00b3f827d485878c85a1358995f8eb35cb.
//
// Solidity: event WhitelistEdit(address account, bool whitelisted)
func (_WhitelistConstraintModule *WhitelistConstraintModuleFilterer) ParseWhitelistEdit(log types.Log) (*WhitelistConstraintModuleWhitelistEdit, error) {
	event := new(WhitelistConstraintModuleWhitelistEdit)
	if err := _WhitelistConstraintModule.contract.UnpackLog(event, "WhitelistEdit", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
