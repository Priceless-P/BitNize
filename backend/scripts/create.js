const { ethers } = require("hardhat");
const { BigNumber } = ethers;

const factoryAbi = require("../artifacts/contracts/BusinessSharesTokenFactory.sol/BusinessSharesTokenFactory.json").abi;
const factoryAddress = "0x53874c20E995bcbbC05cB6bAC61CaAe4A30C4fcD";
const tokenAbi = require("../artifacts/contracts/BusinessSharesToken.sol/BusinessSharesToken.json").abi;
const contractAddress = "0x44C370CDc80AB7007ABeDFc7Fc4bfCe8797F24B4";

async function main() {
  try {
    const [deployer] = await ethers.getSigners();

    console.log("Using account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const factory = new ethers.Contract(factoryAddress, factoryAbi, deployer);

    const tokenName = "IJB";
    const tokenSymbol = "JB";
    const documentsURI = "path/to/documents";
    const initialSupplyPercentage = 10;
    const tokenPrice = ethers.utils.parseEther("0.0006");

    const transaction = await factory.createBusinessSharesToken(
      tokenName, tokenSymbol, documentsURI, initialSupplyPercentage, tokenPrice
    );

    const receipt = await transaction.wait(); // Wait for transaction to be mined
    const tokenAddress = receipt.events[0].address;

    console.log("BusinessSharesToken created at address:", tokenAddress);

    // Example of minting tokens on the newly created token contract
    // await mintTokens(tokenAddress);

  } catch (error) {
    console.error("Error in main function:", error);
  }
}

async function mintTokens(tokenAddress) {
  try {
    const [deployer] = await ethers.getSigners();

    const token = new ethers.Contract(tokenAddress, tokenAbi, deployer);
    const amountToMint = 15; // Set the amount of tokens to mint

    const transaction = await token.mintTokens(amountToMint);
    await transaction.wait(); // Wait for transaction to be mined

    console.log("Minted", amountToMint, "% tokens on contract at address:", tokenAddress);

  } catch (error) {
    console.error("An error occurred during minting:", error);
  }
}

// Function to buy tokens
async function buyTokens(amount) {
  try {
    const [deployer] = await ethers.getSigners();

    console.log("Using account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const contract = new ethers.Contract(contractAddress, tokenAbi, deployer);
    const tokenPrice = await contract.tokenPrice();

    const requiredValue = BigNumber.from(amount).mul(tokenPrice);

    const gasLimit = await contract.estimateGas.buyTokens(amount, deployer.address);
    const gasPrice = await ethers.provider.getGasPrice();

    const transaction = await contract.buyTokens(amount, deployer.address, {
      value: requiredValue,
      gasLimit: BigNumber.from(gasLimit) * BigNumber.from(10),
      gasPrice: gasPrice
    });

    const receipt = await transaction.wait();

    console.log("Buy tokens transaction:", receipt);

    const balance = await contract.balanceOf(deployer.address);
    console.log("Buyer's balance:", ethers.utils.formatUnits(balance), balance);

  } catch (error) {
    console.error('Error buying tokens:', error);
  }
}

// Example usage
(async () => {
    // await main();
    console.log("Minting.....")
   await mintTokens(contractAddress);
   console.log("Buying......")
  await buyTokens(5);
})();
