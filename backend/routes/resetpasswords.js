const express = require("express");

const resetpasswordController = require("../controllers/resetpasswordController");

const router = express.Router();

router.get("/updatepassword/:id", resetpasswordController.updatepassword);

router.get("/forgotpassword/:id", resetpasswordController.resetpassword);
router.post("/forgotpassword", resetpasswordController.forgotpassword);

module.exports = router;
