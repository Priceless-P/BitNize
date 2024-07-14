const express = require("express");
const { createTransaction, getForSaleTransactions, getTokenTransactions, getForUserTransactions } = require("../controllers/transactionController");
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/create", authenticate, createTransaction);
router.get("/", authenticate, getForSaleTransactions);
router.get("/:id", authenticate, getTokenTransactions);
router.get("/all/:userId", authenticate, getForUserTransactions);

module.exports = router;
