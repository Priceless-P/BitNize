const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  documentsURI: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  isSettled: {
    type: Boolean,
    default: false,
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
    required: true,
  },
  transactionHash: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Transfer = mongoose.model("Transfer", TransferSchema);
module.exports = Transfer;
