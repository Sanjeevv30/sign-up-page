const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const Expense = require("./models/expense");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require("./models/user");
const userRouter = require("./routes/userRouter");
const forgotPassword = require("./models/forgot-Password");
const resetPasswordRoutes = require("./routes/reset-passwords");
const FileUrl = require("./models/FileUrl");


const Order = require("./models/order");
const purchaseRoutes = require("./routes/purchaseRoute");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/check", function(){
  console.log("hello")
});

app.use("/", userRouter);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", resetPasswordRoutes);

app.use((req, res) => {
	console.log(`Requested URL: ${req.url}`);
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(FileUrl);
FileUrl.belongsTo(User);

forgotPassword.sync();
FileUrl.sync();
Order.sync();
User.sync();
sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
