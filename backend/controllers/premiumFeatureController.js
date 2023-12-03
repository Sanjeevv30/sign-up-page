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

exports.getDownloads = async function (req,res,next){
  try{
    const file = await req.user.downloadExpenses();
    res.json({file,premium:req.user.isPremiumUser})

  }catch(err){
    res.status.json({message:"not downloaded"});
  }
}

module.exports = {
  getUserLeaderBoard,
  
};
