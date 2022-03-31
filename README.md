# I did the Smart Contract Challenge

### 1) First was I Setup a project and created a contract

#### Summary

ETHPool provides a service where people can deposit ETH and they will receive weekly rewards. Users must be able to take out their deposits along with their portion of rewards at any time. New rewards are deposited manually into the pool by the ETHPool team each week using a contract function.

#### Requirements

- Only the team can deposit rewards.
- Deposited rewards go to the pool of users, not to individual users.
- Users should be able to withdraw their deposits along with their share of rewards considering the time when they deposited.

#### Goal

Design and code a contract for ETHPool, take all the assumptions you need to move forward.

You can use any development tools you prefer: Hardhat, Truffle, Brownie, Solidity, Vyper.

Useful resources:

- Solidity Docs: https://docs.soliditylang.org/en/v0.8.4
- Educational Resource: https://github.com/austintgriffith/scaffold-eth
- Project Starter: https://github.com/abarmat/solidity-starter

### 2) Then I did some test on Hardhat. See image below..

```shell
npx hardhat test
```

![hardhat](/test.png)

### 3) And Deployed the contract

```shell
npx hardhat run ./scripts/deploy.js --network rinkeby
```

Bonus: I also Verified the contract on Etherscan. See image below...

![etherscan](/Etherscan.png)

So there you go...
Hope you learn a thing or two on these smart contract test.
