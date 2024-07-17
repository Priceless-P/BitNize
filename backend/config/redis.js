const { createClient } = require('redis');
const dotenv = require("dotenv");

dotenv.config()
/**
 * Connects to Redis Instance
 */
let redisClient;

(async () => {
  try {
    redisClient = createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        // password: process.env.REDIS_PASSWORD
    });
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.log('Redis connection error:', error);
  }
})();

module.exports = redisClient;
