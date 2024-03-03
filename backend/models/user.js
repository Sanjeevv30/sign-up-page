// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const User = sequelize.define("tracker", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   isPremiumUser: Sequelize.BOOLEAN,
//   totalExpenses: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0,
//   },
// });
// module.exports = User;

const { mongoose, Schema } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
       
        isPremiumUser: {
            type: Boolean,
            required: false 
        },
        totalExpenses: {
            type: Number,
            default:0
        }
    }
);

module.exports = mongoose.model('User', userSchema);

