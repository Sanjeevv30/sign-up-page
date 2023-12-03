const express = require("express");

const resetpasswordController = require("../controllers/resetPasswordController");

const router = express.Router();

router.get("/update-password/:id", resetpasswordController.updatePassword);

router.get("/forgot-password/:id", resetpasswordController.resetPassword);

router.post("/forgot-password", resetpasswordController.forgotPassword);

module.exports = router;
