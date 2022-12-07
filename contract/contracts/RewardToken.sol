// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor() ERC20("Reward Token", "RT") {}

    function mint(address to, uint256 value) public onlyOwner {
        _mint(to, value);
    }
}
