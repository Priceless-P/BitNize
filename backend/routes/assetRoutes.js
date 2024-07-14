const express = require('express');
const router = express.Router();
const { getAllAssets, getAssetDetails } = require('../controllers/assetController');
const { authenticate } = require('../middlewares/authMiddleware');


router.get('/', authenticate, getAllAssets);
router.get('/:tokenId', authenticate, getAssetDetails);
module.exports = router;
