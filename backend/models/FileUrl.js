const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FileUrl = sequelize.define('FileUrl',{
    url:{
        type:Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    }
})
module.exports = FileUrl;
