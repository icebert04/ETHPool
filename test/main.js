const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

let Owner, Team_Member, User_A, User_B, eth_Pool;

describe("ETHPool", function () {
  beforeEach(async function () {
    [Owner, Team_Member, User_A, User_B] = await ethers.getSigners();
    const ETHPool = await ethers.getContractFactory("ETHPool");
    eth_Pool = await ETHPool.deploy();
    await eth_Pool.deployed();
  });

  it("Deposit ETH to the pool", async function () {
    const depositAmount = parseEther("1");
    const tx = {
      to: eth_Pool.address,
      value: depositAmount,
    };
    await User_A.sendTransaction(tx);
    expect(await eth_Pool.total()).to.be.equal(depositAmount);

    await User_B.sendTransaction(tx);
    expect(await eth_Pool.total()).to.be.equal(depositAmount.mul(2));
  });

  it("Withdraw ETH without rewards", async function () {
    const depositAmount = parseEther("1");
    const tx = {
      to: eth_Pool.address,
      value: depositAmount,
    };
    const balance = await User_A.getBalance();
    await User_A.sendTransaction(tx);
    await eth_Pool.connect(User_A).withdraw();
    const newBalance = await User_A.getBalance();
    expect(newBalance).to.be.within(balance.sub(depositAmount), balance);
  });

  it("Deposit rewards", async function () {
    const rewardsAmount = parseEther("200");
    await expect(
      eth_Pool.connect(Owner).depositRewards({ value: rewardsAmount })
    ).to.be.reverted;

    await User_A.sendTransaction({
      to: eth_Pool.address,
      value: parseEther("100"),
    });
    await User_B.sendTransaction({
      to: eth_Pool.address,
      value: parseEther("300"),
    });

    await eth_Pool.connect(Owner).depositRewards({ value: rewardsAmount });

    expect(await eth_Pool.connect(User_A).userBalance()).to.be.equal(
      parseEther("150")
    );
    expect(await eth_Pool.connect(User_B).userBalance()).to.be.equal(
      parseEther("450")
    );
  });

  it("Deposit rewards for participating users only", async function () {
    const rewardsAmount = parseEther("200");
    await expect(
      eth_Pool.connect(Owner).depositRewards({ value: rewardsAmount })
    ).to.be.reverted;

    await User_A.sendTransaction({
      to: eth_Pool.address,
      value: parseEther("100"),
    });

    await eth_Pool.connect(Owner).depositRewards({ value: rewardsAmount });

    await User_B.sendTransaction({
      to: eth_Pool.address,
      value: parseEther("300"),
    });

    expect(await eth_Pool.connect(User_A).userBalance()).to.be.equal(
      parseEther("300")
    );
    expect(await eth_Pool.connect(User_B).userBalance()).to.be.equal(
      parseEther("300")
    );
  });

  it("Add team members", async function () {
    await expect(eth_Pool.addMember(Team_Member.address)).to.be.emit(
      eth_Pool,
      "AddMember"
    );
  });

  it("Team members can only Deposit rewards", async function () {
    const rewardsAmount = parseEther("100");
    const tx = {
      to: eth_Pool.address,
      value: parseEther("100"),
    };

    await User_A.sendTransaction(tx);
    await User_B.sendTransaction(tx);

    await expect(
      eth_Pool.connect(Team_Member).depositRewards({ value: rewardsAmount })
    ).to.be.reverted;

    await expect(eth_Pool.addMember(Team_Member.address)).to.be.emit(
      eth_Pool,
      "AddMember"
    );

    await eth_Pool.connect(Team_Member).depositRewards({ value: rewardsAmount });

    expect(await eth_Pool.connect(User_A).userBalance()).to.be.equal(
      parseEther("150")
    );
    expect(await eth_Pool.connect(User_B).userBalance()).to.be.equal(
      parseEther("150")
    );
  });
});
