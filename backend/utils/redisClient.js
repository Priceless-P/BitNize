const redis = require("../config/redis");

class RedisClient {
  /**
   * Defines SET methods
   * for setting (key, value) in Redis
   */
  setValue = async (key, value, expiry = 3600) => {
    try {
      await redis.setEx(key, expiry, JSON.stringify(value));
    } catch (err) {
      console.error("Redis set error:", err);
    }
  };

  /**
   * Defines GET methods
   * for get value given a (key) in Redis
   */
  getValue = async (key) => {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Redis get error:", err);
    }
  };

  /**
   * Defines DELETE methods
   * for deleting (key, value) in Redis
   */
  deleteValue = async (key) => {
    try {
      await redis.del(key);
    } catch (err) {
      console.error("Redis delete error:", err);
    }
  };

  /**
   * Defines get key methods
   * for deleting (key, value) in Redis
   */
  getKeys = async (pattern) => {
    try {
      return await redis.keys(pattern);
    } catch (err) {
      console.error("Redis keys error:", err);
    }
  };

  /**
   * Checks whether or not Redis is ready
   */
  isReady = () => {
    return redis.isOpen;
  };
}

module.exports = new RedisClient();
