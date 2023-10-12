const User = require("../models/user");
const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderBoardUser = await User.findAll({
      order:[['totalExpenses','DESC']]
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
