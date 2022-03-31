//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ETHPool is AccessControl {
    event Deposit(address _address, uint256 _value);
    event Withdraw(address _address, uint256 _value);
    event DepositRewards(address _address, uint256 _value);
    event AddMember(address _address);
    event RemoveMember(address _address);

    bytes32 public constant ETHPOOL_TEAM_MEMBER =
        keccak256("ETHPOOL_TEAM_MEMBER");

    uint256 public total;

    address[] users;

    mapping(address => bool) userExists;

    mapping(address => uint256) deposits;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ETHPOOL_TEAM_MEMBER, msg.sender);
    }

    receive() external payable {
        if (!userExists[msg.sender]) {
            users.push(msg.sender);
        }
        userExists[msg.sender] = true;
        deposits[msg.sender] += msg.value;
        total += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public {
        uint256 deposit = deposits[msg.sender];

        require(deposit > 0);

        deposits[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: deposit}("");
        require(success, "Transfer failed");

        emit Withdraw(msg.sender, deposit);
    }

    function depositRewards() public payable onlyRole(ETHPOOL_TEAM_MEMBER) {
        require(total > 0, "Pool is empty!");

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 rewards = ((deposits[user]) * msg.value) / total;
            deposits[user] += rewards;
        }

        emit DepositRewards(msg.sender, msg.value);
    }

    function userBalance() public view returns (uint256) {
        return deposits[msg.sender];
    }

    function addMember(address account) public {
        grantRole(ETHPOOL_TEAM_MEMBER, account);
        emit AddMember(account);
    }

    function removeMember(address account) public {
        grantRole(ETHPOOL_TEAM_MEMBER, account);
    }
}
