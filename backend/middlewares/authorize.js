const jwt = require('jsonwebtoken');
const User= require('../models/user');

// exports.authenticate = async(req,res,next)=>{
//     try{ 
//         console.log(req.headers.authorization)
//         const payload = jwt.verify( req.headers.authorization,'secretKey');
//         console.log("first Payload",payload)
//         const user = await User.findOne({where:{id:payload.userId}});
//         req.user = user;
//         console.log("First user",user);
//         next();
//     }catch(err){
//        return  res.status(500).json({Message:'err',err})
//     }
// }
exports.authenticate = async(req,res,next)=>{
    try{
const token = req.headers.authorization;
const secretKey = 'secretKey';
const decodedId = jwt.verify(token, secretKey);
const loggedInUserData = await User.findOne({ _id: decodedId.userId });
if (!loggedInUserData) {
    return res.status(401).json({ error: "User not found" });
}
req.user = loggedInUserData;
next();
} catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Error in the Authentication" });
}
};






