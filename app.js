const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const Expense = require("./backend/models/expense");
const premiumFeatureRoutes = require("./backend/routes/premiumFeature");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./backend/util/database");
const User = require("./backend/models/user");
const userRouter = require("./backend/routes/userRouter");
const Forgotpassword = require("./backend/models/forgotpassword");
const resetPasswordRoutes = require("./backend/routes/resetpasswords");
const FileUrl = require("./backend/models/FileUrl");
const helmet = require("helmet");
const morgan = require("morgan");

const Order = require("./backend/models/orders");
const purchaseRoutes = require("./backend/routes/purchaseRoute");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flag: "a" }
);
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(FileUrl);
FileUrl.belongsTo(User);

Forgotpassword.sync();
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
