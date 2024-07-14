const { createClient } = require('redis');

/**
 * Connects to Redis Instance
 */
let redisClient;

(async () => {
  try {
    redisClient = createClient();
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
