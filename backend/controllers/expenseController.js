const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");
const { v1: uuidv1 } = require("uuid");
const UserServices = require('../services/userservice');
const S3Services =require('../services/S3services');
const FileUrl = require("../models/FileUrl");
const { query } = require("express");


exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    console.log(expenses);

    const stringifiedExpense = JSON.stringify(expenses);
    const trackerId = req.user.id;
    const filename = `Expense${trackerId}/${new Date().toLocaleString()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpense, filename);

    //console.log(fileURL);
  await FileUrl.create({
  url:fileURL,
  date: new Date().toLocaleString(),
  trackerId: req.user.id
 }); 

    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message, success: false });
  }
};
exports.createExpense = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }
    const newExpense = await Expense.create(
      {
        amount,
        description,
        category,
        trackerId: req.user.id,
      },
      { transaction: trans }
    );
    const totalExp = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExp);
    await User.update(
      { totalExpenses: totalExp },
      { where: { id: req.user.id }, transaction: trans }
    );
    await trans.commit();
    res.status(201).json(newExpense);
  } catch (error) {
    await trans.rollback();
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    // const Pagination = req.query.pagination;
    // console.log(Pagination);
    const Pagination = req.query.pagination;
    if (Pagination === null || Pagination === undefined || isNaN(Pagination)) {
      return res.status(400).json({ error: "Invalid or missing Pagination value" });
    }
    
    const expenses = await req.user.getExpenses({limit:parseInt(Pagination)});
    res.json(expenses);
  } catch (error) {
    console.log("Error retrieving expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// exports.getAllExpenses = async (req, res, next) => {
//   try {
//     const pagination = parseInt(req.query.pagination);

//     if (isNaN(pagination) || pagination <= 0) {
//       return res.status(400).json({ error: "Invalid pagination value" });
//     }

//     const total = await Expense.count({ where: { trackerId: req.user.id } });
//     const hasNextPage = (pagination * 5) < total;

//     const pageData = {
//       pagination,
//       lastPage: Math.ceil(total / 5),
//       hasNextPage,
//       previousPage: pagination - 1,
//       nextPage: pagination + 1,
//     };

//     const promise1 = req.user.getExpenses({ offset: (pagination - 1) * 5, limit: 5 });
//     const promise2 = req.user.downloadExpenses;
//     const [expenses, files] = await Promise.all([promise1, promise2]);

//     console.log('Check for premiumUser', req.user.premiumUser, req.user.premiumUser === true);

//     res.json({ expenses, pageData, premium: req.user.premiumUser, files });
//   } catch (error) {
//     console.log("Error retrieving expenses:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


exports.getAllFileUrls = async (req, res,  next) => {
  try {
   findurl = await req.user.getFileUrls();
   console.log('files',findurl)
    res.json(findurl);
  } catch (error) {
    console.log("Error retrieving expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteExpense = async (req, res, next) => {
  const tran = await sequelize.transaction();

  try {
    const id = req.params.Id;
    const expense = await Expense.findByPk(id, { transaction: tran });

    if (!expense) {
      await tran.rollback();
      return res.status(404).json({ err: "Expense not found" });
    }

    if (expense.trackerId !== req.user.id) {
      await tran.rollback();
      return res.status(403).json({ err: "Permission denied" });
    }

    await Expense.destroy({
      where: { id: id, trackerId: req.user.id },
      transaction: tran,
    });
    const totalExp = Number(req.user.totalExpenses) - Number(expense.amount);
    console.log(totalExp);
    await User.update(
      { totalExpenses: totalExp },
      { where: { id: req.user.id }, transaction: tran }
    );
    await tran.commit();

    res.status(204).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await tran.rollback();
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateExpense = async (req, res, next) => {
  const tr = await sequelize.transaction();

  try {
    const id = req.params.Id;
    const { amount, description, category } = req.body;

    if (
      typeof amount !== "number" ||
      description.length === 0 ||
      category.length === 0
    ) {
      await tr.rollback();
      return res.status(400).json({ error: "Invalid or missing data" });
    }

    const expense = await Expense.findByPk(id, { transaction: tr });

    if (!expense) {
      await tr.rollback();
      return res.status(404).json({ error: "Expense not found" });
    }

    await expense.update(
      { amount, description, category },
      { transaction: tr }
    );

    await tr.commit();

    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    await tr.rollback();
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};
