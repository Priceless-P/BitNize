const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const DatabaseClient = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sharesRoutes = require("./routes/sharesRoutes");
const assetRoutes = require("./routes/assetRoutes");
const transferRoutes = require("./routes/transferRoutes")
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/business-token", sharesRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/transaction", transactionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
