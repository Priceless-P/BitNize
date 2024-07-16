const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the connected network
  const network = await ethers.provider.getNetwork();
  console.log("Connected network:", network.name);

  const BusinessSharesTokenFactory = await ethers.getContractFactory("BusinessSharesTokenFactory");
  console.log(BusinessSharesTokenFactory)
  const factory = await BusinessSharesTokenFactory.deploy();

  console.log("BusinessSharesTokenFactory deployed to:", factory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
