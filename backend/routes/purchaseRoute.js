const express = require("express");
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();
const authentication = require("../middlewares/authorize");

router.get('/premiumMembership', authentication.authenticate, purchaseController.purchasePremium);

router.post('/updateTransactionStatus',authentication.authenticate,purchaseController.updateTransactionStatus)

module.exports = router;