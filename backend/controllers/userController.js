const User = require("../models/user");
const util = require("../util/database");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//const Expense = require('../models/expense');

function generateJWT(id,name){
  return jwt.sign({userId:id,name:name},'secretKey')
}

function isInputInvalid(e) {
  if (e == null || e == undefined || e.length == 0) {
    return true;
  } else {
    return false;
  }
}
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      isInputInvalid(name) ||
      isInputInvalid(email) ||
      isInputInvalid(password)
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.createLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (isInputInvalid(email) || isInputInvalid(password)) {
      return res.status(400).json({ message: "Field required" });
    }

    const user = await User.findAll({ where: { email: email } });
    console.log("response",user);
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, resp) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "User not authorized" });
        }
        if (resp) {
          console.log("first error", resp);
          return res
            .status(201)
            .json({ message: "User login Successful", user, token:generateJWT(user[0].id,user[0].name)});
        } else {
          console.log(resp);
          return res.status(400).json({ message: "Password not authorized" });
        }
      });
    } else {
      return res.status(404).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
};


