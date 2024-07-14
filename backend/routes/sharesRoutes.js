const express = require('express');
const router = express.Router();
const {createBusinessSharesToken, saveFileHandler} = require('../controllers/sharesController');
const { authenticate } = require('../middlewares/authMiddleware');


router.post('/create', authenticate, createBusinessSharesToken);
router.post('/save-file', saveFileHandler);
module.exports = router;
