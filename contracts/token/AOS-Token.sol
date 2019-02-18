pragma solidity ^0.5.0;

import 'zeppelin-solidity/contracts/token/ERC20.sol';
import 'zeppelin-solidity/contracts/token/ERC20Capped.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';

contract AosToken is ERC20, ERC20Capped, Pausable{

}

