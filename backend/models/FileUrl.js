const { mongoose, Schema } = require('mongoose');

const fileSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
);




// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const FileUrl = sequelize.define('FileUrl',{
//     url:{
//         type:Sequelize.STRING,
//         allowNull: false
//     },
//     date: {
//         type: Sequelize.DATE,
//         allowNull: false
//     }
// })
// module.exports = FileUrl;


module.exports = mongoose.model('FileUrl', fileSchema);