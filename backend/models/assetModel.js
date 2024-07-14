const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  tokenName: {
    type: String,
    required: true,
  },
  tokenSymbol: {
    type: String,
    required: true,
  },
  tokenDocument: {
    type: String},

  approvingAddress: {
    type: String,
    // required: true,
  },
  assetContractAddress: {
    type: String,
    required: true,
  },
  assetDescription: {
    type: String,
  },
  assetIcon: {
    type: String,
  },
  isForSale: {
    type: Boolean,
    default: true,
  },
  totalAvailableForPurchase: {
    type: Number,
    default: 0,
  },
  tokenPrice: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Asset = mongoose.model("Asset", AssetSchema);
module.exports = Asset;
