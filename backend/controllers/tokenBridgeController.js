const Web3 = require("web3");
// const ethers = require('ethers');
const bridgeABI = require("../ABIs/Bridge.json");
const tokenABI = require("../ABIs/IERC20.json");
const federationABI = require("./path_to_abi/Federation.json");

// Ethereum setup
const web3Eth = new Web3(process.env.web3EthURL);
const bridgeEthAddress = process.env.bridgeEthAddress;
const bridgeEth = new web3Eth.eth.Contract(bridgeABI, bridgeEthAddress);

//RSK setup
const web3RSK = new Web3(process.env.web3RSK);
const bridgeRSKAddress = process.env.bridgeRSKAddress;
const RSKFederationAddress = process.env.RSKFederationAddress;
const bridgeRSK = new web3RSK.eth.Contract(bridgeABI, bridgeRSKAddress);
const RSKFederation = new web3Eth.eth.Contract(
  federationABI,
  RSKFederationAddress
);
// function to deposit tokens
export const depositTokens = async (
  userAccount,
  privateKey,
  tokenAddress,
  amount
) => {
  const tokenContract = new web3Eth.eth.Contract(tokenABI, tokenAddress);

  // Approve bridge to spend tokens
  const approveTx = tokenContract.methods.approve(bridgeEthAddress, amount);
  const approveData = approveTx.encodeABI();
  const approveTxObj = {
    to: tokenAddress,
    data: approveData,
    gas: await approveTx.estimateGas({ from: userAccount }),
  };
  const approvedSignedTx = await web3Eth.eth.accounts.signTransaction(
    approveTxObj,
    privateKey
  );
  await web3Eth.eth.sendSignedTransaction(approvedSignedTx.rawTransaction);

  // Deposit token to bridge
  const depositTx = bridgeEth.methods.deposit(amount);
  const depositData = depositTx.encodeABI();
  const depositTxObj = {
    to: bridgeEthAddress,
    data: depositData,
    gas: await depositTx.estimateGas({ from: userAccount }),
  };

  const depositSignedTx = await web3Eth.eth.accounts.signTransaction(
    depositTxObj,
    privateKey
  );
  await web3Eth.eth.sendSignedTransaction(depositSignedTx.rawTransaction);
};

export const claimTokens = async (rskAccount, rskKey) => {
  const claimTx = bridgeRSK.methods.claim();
  const claimData = claimTx.encodeABI();
  const claimTxObj = {
    to: bridgeRSKAddress,
    data: claimData,
    gas: await claimTx.estimateGas({ from: rskAccount }),
  };

  const claimSignedTx = await web3RSK.eth.accounts.signTransaction(
    claimTxObj,
    rskKey
  );
  await web3RSK.eth.sendSignedTransaction(claimSignedTx.rawTransaction);
};

export const lockBTCAndMintRBTC = async (btcAddress, rskAddress, rskKey, amount) => {
    const lockTx = RSKFederation.methods.lockBitcoin(btcAddress, rskAddress, amount);
    const lockTxData = lockTx.encodeABI();
    const lockTxObj = {
        to: RSKFederationAddress,
        data: lockTxData,
        gas: await lockTx.estimateGas(),
    };

    const lockSignedTx = await web3RSK.eth.accounts.signTransaction(lockTxObj, rskKey);
    await web3RSK.eth.sendSignedTransaction(lockSignedTx.rawTransaction);
}
