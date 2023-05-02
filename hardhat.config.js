require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = "PRIVATE_KEY";

module.exports = {
    solidity: "0.8.2",
    networks: {

      hardhat: {
        forking: {
          // ALCHEMY API SHOULD BE HERE AS HTTP
          url: "https://api.avax.network/ext/bc/C/rpc",
          // blockNumber: 1234567
        }
      },

      mainnet: {
        url: `https://api.avax.network/ext/bc/C/rpc`,
          accounts: [`${PRIVATE_KEY}`]
      },
      fuji: {
        url: `https://api.avax-test.network/ext/bc/C/rpc`,
          accounts: [`${PRIVATE_KEY}`]
      }
    }
};