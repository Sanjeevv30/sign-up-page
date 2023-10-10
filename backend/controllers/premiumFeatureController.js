const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/database");


const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderBoardUser = await User.findAll({
      attributes:['id','name',[sequelize.fn('sum',sequelize.col('amount')),'total_cost']],
      include:[
        {
          model : Expense,
          attributes:[]
        }
      ],
      group:['tracker.id'],
      order:[['total_cost','DESC']]
    });
   
    res.status(200).json(leaderBoardUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUserLeaderBoard,
};
