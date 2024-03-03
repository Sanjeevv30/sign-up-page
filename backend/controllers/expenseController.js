const Expense = require("../models/expense");
const UserServices = require("../services/userService");
const S3Services = require("../services/S3services");
const FileUrl = require("../models/FileUrl");

const mongoose = require("mongoose");

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpense = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date().toLocaleString()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpense, filename);

    await FileUrl.create({
      url: fileURL,
      date: new Date().toLocaleString(),
      userId: req.user.id,
    });

    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.error("Error downloading expenses:", error);
    res.status(500).json({ error: "Server error", success: false });
  }
};

exports.createExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    const newExpense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    });

    const totalExp = req.user.totalExpenses + Number(amount);
    req.user.totalExpenses = totalExp;
    await req.user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newExpense);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const page = Number(req.query.page) ;
    const limit = Number(req.query.limit) 

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Invalid page or limit value" });
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find({ userId: req.user.id }).skip(skip).limit(limit),
      Expense.countDocuments({ userId: req.user.id }),
    ]);

    const hasNextPage = skip + limit < total;
    const hasPrePage = page > 1;

    const pageData = {
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      hasNextPage,
      hasPrePage,
    };

    res.json({ expenses, pageData, premium: req.user.premiumUser });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllFileUrls = async (req, res) => {
  try {
    const findUrl = await FileUrl.find({ userId: req.user.id });
    res.json(findUrl);
  } catch (error) {
    console.error("Error retrieving file URLs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = req.params.id;
    console.log("Expense ID:", id);
    
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    },{ session });

    // Check if the expense was found and deleted
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    // Subtract the deleted expense amount from the user's total expenses
    const updatedTotal = req.user.totalExpenses - Number(expense.amount);
    req.user.totalExpenses = updatedTotal;
    await req.user.save();

    await session.commitTransaction();
    res.status(204).json({ message: "Expense deleted successfully" });
  } catch (error) {
  
    await session.abortTransaction();
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    
    session.endSession();
  }
};



exports.updateExpense = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const id = req.params.id;
    console.log("Expense ID:", id);
    const { amount, description, category } = req.body;

    if (typeof amount !== "number" || description.length === 0 || category.length === 0) {
      return res.status(400).json({ error: "Invalid or missing data" });
    }

    const userId = req.user && req.user.id; 
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in request" });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { amount, description, category },
      { new: true, session }
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    
    await session.commitTransaction();
    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    session.endSession();
  }
};

