const express = require('express');
const premiumFeatureController = require("../controllers/premiumFeatureController");
const authentication = require("../middlewares/authorize");
const router = express.Router();

router.get("/showLeaderBoard",authentication.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;