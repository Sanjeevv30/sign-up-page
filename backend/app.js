const express = require("express");
const app = express();
const Expense = require("./models/expense");

const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require("./models/user");
const userRouter = require("./routes/userRouter");

const Order = require("./models/orders");
const purchaseRoutes = require("./routes/purchaseRoute");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/purchase", purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.sync();
User.sync()
sequelize
  .sync()
  .then((result) => {
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
