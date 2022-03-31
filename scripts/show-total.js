require("dotenv");
const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/ETHPool.sol/ETHPool.json");

(async () => {
  const address = "0x0B9C56a3170E59f3FbE66e5D8f868ff554FAA19F";
  const rpcUrl = `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(address, abi, provider);

  const total = await contract.total();
  console.log(`Total ETH in the pool: ${ethers.utils.formatEther(total)}`);
})();
