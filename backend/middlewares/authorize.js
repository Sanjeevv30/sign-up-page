const jwt = require('jsonwebtoken');
const User= require('../models/user');

exports.authenticate = async(req,res,next)=>{
    try{
        const payload = jwt.verify(req.headers.authorization,'secretKey');
        //console.log("first Payload",payload)
        const user = await User.findOne({where:{id:payload.userId}});
        req.user = user;
       // console.log("First user",user);
        next();
    }catch(err){
      return  res.status(500).json({Message:"Failed ",err})
    }
}
