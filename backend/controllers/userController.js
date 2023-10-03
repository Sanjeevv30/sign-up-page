const Login = require('../models/logins');
const User = require('../models/user');
const bcrypt = require('bcrypt');

function isInputInvalid(e){
    if(e==null || e==undefined || e.length==0){
return true;
    }else{
        return false;
    }
}
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({
            name,
            email,
            password
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllUser = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
// exports.createLogin = async(req,res,next)=>{
//     try{
//         const {email,password} = req.body;
//         const newLogin = await Login.create({
//             email,
//             password
//         });
//         res.status(201).json({ message: 'User login successfully', user: newLogin });
//     }catch(error){
//         console.error('Error retrieving users:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// }

exports.createLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(isInputInvalid(email)||isInputInvalid(password)){
            return res.status(400).json({message:"filed required"})
        }
        
        const user = await User.findOne({ where: { email:email } });
console.log(user);
        if (!user) {
            
            return res.status(404).json({ message: 'User not found' });
        }
        //const passwordMatch = await bcrypt.compare(password, user.password);

        if (user && password != user.password) {
            return res.status(201).json({ message: 'User login Unsuccessful', user });
         //} else {
        //     return res.status(401).json({ message: 'User not authorized' });
         }
         res.json({success:true,message:"User logged successful"})
        }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
