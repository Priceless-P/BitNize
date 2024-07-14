const Web3= require("web3");
const asyncHandler = require("express-async-handler");

const factoryAbi = require("../artifacts/contracts/BusinessSharesTokenFactory.sol/BusinessSharesTokenFactory.json").abi;
const factoryAddress = "0x8C7b7747B176Be0986C11cb5f7d4D784776C1fC1";
const tokenAbi = require("../artifacts/contracts/BusinessSharesToken.sol/BusinessSharesToken.json").abi;
const Transfer = require("../models/transferModel");
const User = require("../models/userModel");
const Asset = require("../models/assetModel");
const { validateRequest, saveFile } = require("../utils/utils");
// const rskTestnetMinimumGasPrice = require("../hardhat.config");

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL))
const Contract = new web3.eth.Contract(factoryAbi, factoryAddress);;
class SharesController {
  constructor() {

    this.tokenContract = null;
    this.tokenAddress = null;
  }
  createBusinessSharesToken = asyncHandler(async (request, response) => {
    try {
        const {
            tokenName,
            tokenSymbol,
            documentsURI,
            initialSupply,
            tokenPrice,
            tokenDescription,
            tokenIcon,
            tokenAddress
        } = request.body;

        const requiredFields = [
            "tokenName",
            "tokenSymbol",
            "documentsURI",
            "tokenDescription",
            "tokenIcon",
            "initialSupply",
            "tokenPrice",
            "tokenAddress"
        ];
        const validationError = validateRequest(request.body, requiredFields);
        if (validationError) {
            return response.status(400).send(validationError);
        }

        const id = request.user._id;
        const business = await User.findById(id);
        if (!business) {
            return response.status(400).send({ message: "Business not found" });
        }

        const tokenIconPath = await saveFile(tokenIcon);
        const documentFilePath = await saveFile(documentsURI);

        const asset = new Asset({
            tokenName,
            tokenSymbol,
            tokenDocument: documentFilePath,
            tokenPrice,
            owner: request.user._id,
            assetContractAddress: tokenAddress,
            totalAvailableForPurchase: initialSupply,
            assetIcon: tokenIconPath,
            assetDescription: tokenDescription
        });

        await asset.save();
        console.log(`BusinessSharesToken created successfully at address:`, tokenAddress);
        return response.status(201).send({
            success: true,
            message: `${tokenName} ${tokenSymbol} created successfully}`,
            result: tokenAddress,
        });
    } catch (error) {
        console.error("Error creating BusinessSharesToken:", error);
        return response.status(500).send({
            success: false,
            message: `Internal server error. Try again later`,
            result: "",
        });
    }
});


  saveFileHandler = asyncHandler(async (request, response) => {
    try {
        const { file } = request.body;
        const filePath = await saveFile(file);

        // Return the file path
        return response.status(200).send({ success: true, message: 'File saved successfully', result: filePath });
    } catch (error) {
        return response.status(500).send({ message: 'Error saving file' });
    }
});


  setAssetPrice = asyncHandler(async (request, response) => {
    try {
      const { price } = request.body;
      const validationError = validateRequest(request.body, ["price"]);
      if (validationError) {
        return response.status(400).send(validationError);
      }
      if (!this.tokenContract || this.tokenAddress !== tokenAddress) {
        return response.status(400).send({
          success: false,
          message: "Token Contract not recognized",
          result: "",
        });
      }
      const tx = await this.tokenContract.setTokenPrice(price);
      await tx.wait();
      const asset = Asset.findBy({ assetContractAddress: this.tokenContract });
      if (asset) {
        asset.tokenPrice = price;
        await asset.save();
      }

      return response.status(200).send({
        success: true,
        message: "Token price set successfully",
        result: "",
      });
    } catch (error) {
      console.error("Error setting token price:", error);
      return response.status(500).send({
        success: false,
        message: "Error setting token price:",
        error,
        result: "",
      });
    }
  });

  mintTokens = asyncHandler(async (request, response) => {
    try {
      const { amount } = request.body;
      const validationError = validateRequest(request.body, ["amount"]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const tx = await this.tokenContract.mintTokens(amount);
      await tx.wait();

      const asset = Asset.findBy({ assetContractAddress: this.tokenContract });
      if (asset) {
        asset.totalAvailableForPurchase += amount;
        await asset.save();
      }

      return response.status(200).send({
        success: true,
        message: "Tokens minted successfully",
        result: "",
      });
    } catch (error) {
      console.error("Error minting tokens:", error);
      return response.status(500).send({
        success: false,
        message: "Error minting tokens:",
        error,
        result: "",
      });
    }
  });

  buyShares = asyncHandler(async (request, response) => {
    try {
      const { tokenId, amount } = request.body;
      const validationError = validateRequest(request.body, [
        "tokenId",
        "amount",
      ]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const asset = await Asset.findById(tokenId);
      if (!asset) {
        return response.status(404).send({
          success: false,
          message: "Asset not found",
          result: "",
        });
      }

      const tokenPrice = asset.tokenPrice;
      const totalCost = tokenPrice.mul(amount);

      const tx = await this.tokenContract.buyTokens(amount, {
        value: totalCost,
      });
      await tx.wait();

      return response.status(200).send({
        success: true,
        message: `Congratulations! You now on ${amount} of ${asset.tokenSymbol} Shares!`,
        result: "",
      });
    } catch (error) {
      console.error("Error buying shares:", error);
      return response.status(500).send({
        success: false,
        message: "Error buying shares",
        error,
        result: "",
      });
    }
  });

  requestTransfer = asyncHandler(async (request, response) => {
    try {
      const { from, to, amount, documentsURI } = request.body;
      const requiredFields = ["from", "to", "amount", "documentsURI"];
      const validationError = validateRequest(request.body, requiredFields);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const tx = await this.tokenContract.requestTransfer(
        to,
        amount,
        documentsURI
      );
      await tx.wait();

      const transfer = new Transfer({
        from,
        to,
        amount,
        documentsURI,
        contractAddress: this.tokenContract.address,
      });
      await transfer.save();

      return response.status(200).send({
        success: true,
        message: "Transfer request created successfully",
        result: transfer,
      });
    } catch (error) {
      console.error("Error requesting transfer:", error);
      return response.status(500).send({
        success: false,
        message: "Error requesting transfer",
        error,
        result: "",
      });
    }
  });

  approveTransfer = asyncHandler(async (request, response) => {
    try {
      const { transferId } = request.body;
      const validationError = validateRequest(request.body, ["transferId"]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const transfer = await Transfer.findById(transferId);
      if (!transfer) {
        return response.status(404).send({
          success: false,
          message: "Transfer not found",
          result: "",
        });
      }

      const tx = await this.tokenContract.approveTransfer(transferId);
      await tx.wait();

      transfer.approved = true;
      await transfer.save();

      return response.status(200).send({
        success: true,
        message: "Transfer approved successfully",
        result: transfer,
      });
    } catch (error) {
      console.error("Error approving transfer:", error);
      return response.status(500).send({
        success: false,
        message: "Error approving transfer",
        error,
        result: "",
      });
    }
  });

  getTransferDetails = asyncHandler(async (request, response) => {
    try {
      const { transferId } = request.params;
      const validationError = validateRequest({ transferId }, ["transferId"]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const transfer = await Transfer.findById(transferId);
      if (!transfer) {
        return response.status(404).send({
          success: false,
          message: "Transfer not found",
          result: "",
        });
      }

      return response.status(200).send({
        success: true,
        message: "Transfer details retrieved successfully",
        result: transfer,
      });
    } catch (error) {
      console.error("Error retrieving transfer details:", error);
      return response.status(500).send({
        success: false,
        message: "Error retrieving transfer details",
        error,
        result: "",
      });
    }
  });
}

module.exports = new SharesController();
