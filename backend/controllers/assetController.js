const asyncHandler = require("express-async-handler");
const Asset = require("../models/assetModel");

class AssetController {
  getAllAssets = asyncHandler(async (_request, response) => {
    try {
      const assets = await Asset.find({ isForSale: true }).populate("owner");
      response.status(200).send({
        success: true,
        message: "All assets retrieved successfully",
        result: assets,
      });
    } catch (error) {
      console.error("Error retrieving assets:", error);
      response.status(500).send({
        success: false,
        message: "Error retrieving assets",
        error,
        result: "",
      });
    }
  });

  getAssetDetails = asyncHandler(async (request, response) => {
    try {
      const { tokenId } = request.params;
      const asset = await Asset.findById(tokenId).populate("owner");
      if (!asset) {
        return response.status(404).send({
          success: false,
          message: "Asset not found",
          result: "",
        });
      }
      response.status(200).send({
        success: true,
        message: "Asset details retrieved successfully",
        result: asset,
      });
    } catch (error) {
      console.error("Error retrieving asset details:", error);
      response.status(500).send({
        success: false,
        message: "Error retrieving asset details",
        error,
        result: "",
      });
    }
  });
}

module.exports = new AssetController();
