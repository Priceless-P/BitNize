const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    email: {
      type: String,
      requires: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
    businessName: {
        type: String,
        // required: true,
      },
    wallets: {
        type: [String],
        default: []},
    location: {
        type: String,
        // required: true,
      },
      yearStarted: {
        type: Number,
        // required: true,
      },
      legalDocumentsURI: {
        type: String,
        // required: true,
      },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
