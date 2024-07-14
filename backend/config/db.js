const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
/**
 * Db class
 */
class DatabaseClient {

  constructor() {
    this.isConnected = false;
    this.connectToDatabase();
  }

  /**
   * Connects to MongoDB
   */
  async connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
      this.isConnected = true;
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  }

/**
 * Checks whether or not Mongodb is connected
 */
  isMongooseReady() {
    return this.isConnected;
  }
}

module.exports = new DatabaseClient();
