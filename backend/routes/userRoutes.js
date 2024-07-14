const express = require('express');

const {addWallet, getUserPortfolio, sendForgotPasswordEmail, resetPassword} = require("../controllers/userController");
const {authenticate} = require("../middlewares/authMiddleware")
const router = express.Router();

router.post('/addWallet', authenticate, addWallet);
router.get('/assets', authenticate, getUserPortfolio);
router.post('/forgot-password', sendForgotPasswordEmail);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
