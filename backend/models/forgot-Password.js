// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const forgotPassword = sequelize.define('forgotPassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresBy: Sequelize.DATE
// })

// module.exports = forgotPassword;

const { mongoose, Schema } = require("mongoose");

const resetPasswordSchema = new Schema({
  uuid: {
    type: Schema.Types.UUID,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
module.exports = mongoose.model("ForgotPasswordRequest", resetPasswordSchema);
