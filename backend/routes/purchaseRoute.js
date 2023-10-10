const express = require("express");
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();
const authentication = require("../middlewares/authorize");

router.get('/premiummembership', authentication.authenticate, purchaseController.purchasepremium);
router.post('/updatetransactionstatus',authentication.authenticate,purchaseController.updatetransactionstatus)

module.exports = router;