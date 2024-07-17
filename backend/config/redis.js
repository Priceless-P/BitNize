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
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: 'redis-18072.c239.us-east-1-2.ec2.redns.redis-cloud.com',
            port: 18072
        }
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
