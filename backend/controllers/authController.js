const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const {validateRequest, saveFile} = require("../utils/utils");
const redisClient = require("../utils/redisClient")


const {
  hashPassword,
  verifyPassword,
  generateToken,
  cacheToken,
  storeCookie,
} = require("../utils/userUtils");

/**
 * Handles User's Authentication
 */
class AuthController {

  /**
   * Registers a new user
   */
  registerUser = asyncHandler(async (request, response) => {
    try {
      const { firstName, lastName, email, password, isCompany } = request.body;

      const validationError = validateRequest(request.body, [
        "firstName",
        "lastName",
        "email",
        "password",

      ]);
      if (validationError) {
        return response.status(400).send(validationError);
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return response
          .status(400)
          .send({ success: false, message: "User with email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isCompany,
      });
      if (isCompany) {
        const { businessName, location, yearStarted, legalDocumentsURI } =
          request.body;
        const validationError = validateRequest(request.body, [
          "businessName",
          "location",
          "yearStarted",
          "legalDocumentsURI",
        ]);
        if (validationError) {
          return response.status(400).send(validationError);
        }
        const legalDocumentsURIPath = await saveFile(legalDocumentsURI);
        user.businessName = businessName;
        user.location = location;
        user.yearStarted = yearStarted;
        user.legalDocumentsURI = legalDocumentsURIPath;
        await user.save();
      }

      if (user) {
        // Cache user
        const token = generateToken(user._id);
        cacheToken(token, user);
        return response.status(201).send({
          success: true,
          message: "Account created successfully",
          result: user,
          token
        });
      } else {
        return response
          .status(400)
          .send({ success: false, message: "Invalid user data" });
      }
    } catch (err) {
        console.log(err);
        return response
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  });

  /**
   * Logs in a user
   */
  loginUser = asyncHandler(async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password)
      return response.status(400).send({
        success: false,
        message: "Incomplete Details. Email or password is missing",
        result: "",
      });

    const user = await User.findOne({ email });

    if (user && (await verifyPassword(password, user.password))) {
      const token = generateToken(user._id);
      cacheToken(token, user);
      storeCookie(response, token);
      return response.status(201).send({
        success: true,
        message: "Login Successful",
        result: user,
        token
      });
    } else {
      response
        .status(400)
        .send({ success: false, message: "Invalid user data", result: "" });
    }
  });

  /**
   * Logs out a user
   */
  logoutUser = asyncHandler(async (request, response) => {
    const token = request.cookies["Bit-Token"];

    if (!token) {
      return response.status(400).send({
        success: false,
        message: "No token found, user already logged out or not logged in",
      });
    }

    await redisClient.deleteValue(token);

    response.clearCookie("Bit-Token");
    request.user = undefined;

    return response.status(200).send({
      success: true,
      message: "User logged out successfully",
      result: "",
    });
  });
}

module.exports = new AuthController();
