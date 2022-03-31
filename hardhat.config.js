require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({path:__dirname+'/./.env'})

const KEY = [process.env.KEY_PRIVATE];

const ETHERSCAN_API = [process.env.ETHERSCAN];

const ALCHEMY_KEY = [process.env.ALCHEMY];
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`${KEY}`],
      chainId: 4,
      networkId: 4,
    },
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API}`,
  },
};
