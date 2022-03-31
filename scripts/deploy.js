const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const ethPool = await hre.ethers.getContractFactory("ethPool");
  const ETHPool = await ethPool.deploy();
  await ETHPool.deployed();
  console.log("ETHPool deployed to:", ETHPool.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
