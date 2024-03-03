const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const secretKey = "secretKey";
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }
    const payload = jwt.verify(token, secretKey);
    const loggedInUserData = await User.findById(payload.userId);
    if (!loggedInUserData) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = loggedInUserData;
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(500).json({ message: "Error in the Authentication" });
  }
};



