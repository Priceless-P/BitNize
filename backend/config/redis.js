const { createClient } = require("redis");

/**
 * Connects to Redis Instance
 */
let redisClient;

(async () => {
  try {
    redisClient = createClient({
      host: "redis-18072.c239.us-east-1-2.ec2.redns.redis-cloud.com",
      port: 18072,
    });
    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.log("Redis connection error:", error);
  }
})();

module.exports = redisClient;
