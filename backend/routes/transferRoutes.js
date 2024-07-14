const express = require('express');
const router = express.Router();
const {requestTransfer, approveTransfer, claimTransfer, pendingApproval, pendingSettle} = require('../controllers/transferController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/pending/:userId', authenticate, pendingApproval);
router.get('/settle/:userId', authenticate, pendingSettle);
router.post('/request', authenticate, requestTransfer);
router.post('/approve/:transferId', authenticate, approveTransfer);
router.post('/paid', authenticate, claimTransfer);
module.exports = router;
