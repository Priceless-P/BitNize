const { ethers } = require("hardhat");
const { BigNumber } = ethers;

const factoryAbi = require("../artifacts/contracts/BusinessSharesTokenFactory.sol/BusinessSharesTokenFactory.json").abi;
const factoryAddress = "0x3D6969afA09d329A8e2E36A4676418f2d68cb3B3";
const tokenAbi = require("../artifacts/contracts/BusinessSharesToken.sol/BusinessSharesToken.json").abi;
const contractAddress = "0x44C370CDc80AB7007ABeDFc7Fc4bfCe8797F24B4";

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Example usage of the functions
    //await requestTransfer(deployer.address, "0x31cc96d9346354225fb080dEaa964231Ca6c62Ab", 2);
    const transferId = await getTransferId("0x31cc96d9346354225fb080dEaa964231Ca6c62Ab", 2);
    console.log("Transfer ID:", transferId.toString());

    //await approveTransfer(transferId, "path/to/documents");
    await buyAndTransferTokens(transferId.toString());
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

async function requestTransfer(from, to, amount) {
  try {
    const [deployer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);

    const transaction = await contract.requestTransfer(from, to, amount);
    await transaction.wait(); // Wait for the transaction to be mined

    console.log("Request transfer transaction:", transaction);
  } catch (error) {
    console.error("Error requesting transfer:", error);
  }
}

async function getTransferId(to, amount) {
  try {
    const [deployer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);

    const transferId = await contract.getTransferId(to, amount);
      const getTransferDetails = await contract.getTransferDetails(transferId.toString());
      const price = await contract.tokenPrice();
      console.log(getTransferDetails)
      console.log(price)
    return transferId;
  } catch (error) {
    console.error("Error getting transfer ID:", error);
    return 0;
  }
}

async function approveTransfer(transferId, documentsURI) {
  try {
    const [deployer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);

    const transaction = await contract.approveTransfer(transferId, documentsURI);
    await transaction.wait(); // Wait for the transaction to be mined

    console.log("Approve transfer transaction:", transaction);
  } catch (error) {
    console.error("Error approving transfer:", error);
  }
}

async function buyAndTransferTokens(transferId) {

    try {
      const [deployer] = await ethers.getSigners();
      const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);

      const transfer = await contract.shareTransfers(transferId);
      const tokenPrice = await contract.tokenPrice();
      const amount = BigNumber.from(transfer.amount);

      const payableAmount = amount * (BigNumber.from(tokenPrice));

      const gasLimit = await contract.estimateGas.buyAndTransferTokens(transferId);
      const gasPrice = await ethers.provider.getGasPrice();

      const transaction = await contract.buyAndTransferTokens(transferId, {
        value: payableAmount,
        gasLimit: gasLimit,
      gasPrice: gasPrice
      });

      await transaction.wait(); // Wait for the transaction to be mined

      console.log("Buy and transfer tokens transaction:", transaction);
    } catch (error) {
      console.error("Error buying and transferring tokens:", error);
    }
  }

  async function executeBuyTokensTransaction(transferId) {
    try {
      const [deployer] = await ethers.getSigners();
      const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);

      const transfer = await contract.shareTransfers(transferId);
      const tokenPrice = await contract.tokenPrice();
      const decimals = await contract.decimals(); // Get token decimals
      const amount = ethers.BigNumber.from(transfer.amount);

      const gasPrice = await ethers.provider.getGasPrice();
      const payableAmount = amount.mul(tokenPrice);
      let gasLimit = await contract.estimateGas.verifyAndTransferTokens(transferId);
      // Execute verify and transfer tokens
      const tx = await contract.verifyAndTransferTokens(transferId, {
        gasLimit: gasLimit,
      gasPrice: gasPrice
      });
      await tx.wait()
        console.log("verifyAndTransferTokens successful", tx);

        const gasPrice_ = await ethers.provider.getGasPrice();

        let gasLimit_ = await contract.estimateGas.transferAndRefund(transferId);
      // Execute transfer and refund
      const tx_ = await transferAndRefund(transferId, {
        value: payableAmount,
        gasLimit: gasLimit_,
      gasPrice: gasPrice_
      });
        await tx_.wait();
        console.log("transfer and refund success, tx_")

      console.log("Buy tokens transaction completed successfully.");
    } catch (error) {
      console.error("Error executing buy tokens transaction:", error);
    }
  }
main();
