const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Asset = require("../models/assetModel");
const Transfer = require("../models/transferModel");
const {validateRequest} = require("../utils/utils")
const {
  hashPassword,
  generateToken,
  sendEmail,
} = require("../utils/userUtils");

class UserController {
  getUserPortfolio = asyncHandler(async (request, response) => {
    const userId = request.user._id;
    const assets = await Asset.find({ owner: userId });

    response.status(200).send({
      success: true,
      message: "User portfolio retrieved successfully",
      result: assets,
    });
  });

  getUserDetails = asyncHandler(async (request, response) => {
    try {
      const userId = request.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return response.status(404).send({
          success: false,
          message: "User not found",
          result: "",
        });
      }
      response.status(200).send({
        success: true,
        message: "User details retrieved successfully",
        result: user,
      });
    } catch (error) {
      console.error("Error retrieving user details:", error);
      response.status(500).send({
        success: false,
        message: "Error retrieving user details",
        error,
        result: "",
      });
    }
  });
    /**
   * Adds a wallet address to a user
   */
    addWallet = asyncHandler(async (request, response) => {
        const { userId, walletAddress } = request.body;
        const validationError = validateRequest(request.body, ["userId", "walletAddress"]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

        try {
          const user = await User.findById(userId);

          if (!user) {
            return response.status(404).send({ success: false, message: "User not found" });
          }
          user.wallets.push(walletAddress);
          await user.save();

          return response.status(200).send({ success: true, message: "Wallet saved", result: user });
        } catch (error) {
          console.error(error);
          return response.status(500).send({ success: false, message: "Failed to add wallet" });
        }
      });

  getUserTransactions = asyncHandler(async (request, response) => {
    try {
      const userId = request.user._id;
      const transfers = await Transfer.find({ from: userId });
      response.status(200).send({
        success: true,
        message: "User transactions retrieved successfully",
        result: transfers,
      });
    } catch (error) {
      console.error("Error retrieving user transactions:", error);
      response.status(500).send({
        success: false,
        message: "Error retrieving user transactions",
        error,
        result: "",
      });
    }
  });

  /**
   * Sends Password reset Token Email
   */
  sendForgotPasswordEmail = asyncHandler(async (request, response) => {
    const { email } = request.body;

    if (!email)
      return response
        .status(400)
        .send({ success: false, message: "Email is missing", result: "" });

    const user = await User.findOne({ email });

    if (!user)
      return response.status(404).send({
        success: false,
        message: "User with this email does not exist",
        result: "",
      });

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10mins

    await user.save();

    const resetURL = `${process.env.RESET_TOKEN_URL}/${resetToken}`;
    const message = `Hello ${user.username},
        [Click here](${resetURL}) to reset your password`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });
      return response
        .status(200)
        .send({ success: true, data: "Password reset email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return response.status(500).send({
        success: false,
        message: "Email could not be sent",
        result: err,
      });
    }
  });

  /**
   * Reset User's Password
   */
  resetPassword = asyncHandler(async (request, response) => {
    try {
      const resetPasswordToken = request.params.token;
      const { password } = request.body;
      if (!password)
        return response.status(400).send({
          success: false,
          message: "New Password is required",
          result: "",
        });

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user)
        return response.status(400).send({
          success: false,
          message: "Token is invalid or expired",
          result: "",
        });

      user.password = await hashPassword(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return response.status(200).send({
        success: true,
        message: "Password reset successful",
        result: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);

      return response
        .status(500)
        .send({ success: false, message: "Server Error", result: "" });
    }
  });
}

module.exports = new UserController();
