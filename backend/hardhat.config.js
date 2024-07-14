/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const fs = require("fs");

const rskTestnetSeedPhrase = fs
  .readFileSync(".rsk-testnet-seed-phrase")
  .toString()
  .trim();

if (!rskTestnetSeedPhrase || rskTestnetSeedPhrase.split(" ").length != 12) {
  throw new Error("Provide valid BIP-39 seed phrase in a file");
}

const rskTestnetBlockRpcResponse = fs
  .readFileSync(".rsk-testnet-block-rpc-response.json")
  .toString()
  .trim();

const rskTestnetMinimumGasPrice = parseInt(
  JSON.parse(rskTestnetBlockRpcResponse).result.minimumGasPrice,
  16);

if (typeof rskTestnetMinimumGasPrice !== "number" ||
  isNaN(rskTestnetMinimumGasPrice)) {
  throw new Error(
    "unable to retrieve network gas price \
    from .rsk-testnet-block-rpc-response.json");
    }
console.log("Minimum gas price for RSK Testnet: " + rskTestnetMinimumGasPrice);

const rskTestNetGasMultiplier = 1.1;

require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-tracer");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    rskregtest: {
      url: "http://localhost:4444",
    },
    rsktestnet: {
        chainId: 31,
        url: 'https://public-node.testnet.rsk.co/',
        gasPrice: rskTestnetMinimumGasPrice,
        gasPriceMultiplier: rskTestNetGasMultiplier,
        accounts: {
            mnemonic: rskTestnetSeedPhrase,
            path: "m/44'/60'/0'/0",
            initialIndex: 0,
            count:10,
            },
        },
        AlysTestnet: {
            chainId: 212121,
            url: 'http://107.20.115.193:8545',
            // gasPrice: rskTestnetMinimumGasPrice,
            // gasPriceMultiplier: rskTestNetGasMultiplier,
            accounts: {
                mnemonic: rskTestnetSeedPhrase,
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count:10,
                },
            }
    },
    // sourcify: {
    //     enabled: true
    //   },
    etherscan: {
        apiKey: "F8KCIJZ85S9E1RDQ89GU2JCXQDQ185MGZ3"
    },
    customChains: [
        {
            network: "rsktestnet",
            chainId: 31,
            urls: {
                apiURL: "https://rootstock-testnet.blockscout.com/api/",
                browserURL: "https://rootstock-testnet.blockscout.com/",
            }
        }
    ]
};
