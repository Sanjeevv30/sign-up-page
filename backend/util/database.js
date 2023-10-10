const Sequelize = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize("node_complete", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
