const asyncHandler = require("express-async-handler");

const redisClient = require("../utils/redisClient");


/**
 * Sets request.user for current user
 *
 */
const authenticate = asyncHandler(async (request, response, next) => {
    const token = request.cookies["Bit-Token"];

    if (!token) {
        return response.status(401).json({ message: "Authentication token not found" });
    }

    const userDetails = await redisClient.getValue(token);

    if (!userDetails) {
        return response.status(401).json({ message: "Invalid token, user details not found" });
    }

    request.user = JSON.parse(userDetails);
    next();
});


module.exports = { authenticate };
