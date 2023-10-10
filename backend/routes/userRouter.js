const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
//const userController = require("../controllers/userController");
const Expense = require('../models/expense');
const authentication = require("../middlewares/authorize");
const userController = require("../controllers/userController");

router.post("/add-user/Signup", userController.createUser);
// router.post("/add-user/Signup", function(req, res){
//     userController.createUser
//   });

router.post("/login", userController.createLogin);

router.get("/get-user/signup", userController.getAllUser);

router.post("/expense/add-expense",authentication.authenticate, expenseController.createExpense);

router.get("/expense/get-expense",authentication.authenticate, expenseController.getAllExpenses);

router.delete("/expense/delete/:Id",authentication.authenticate,expenseController.deleteExpense);

router.put("/expense/edit/:Id", expenseController.updateExpense);

module.exports = router;
