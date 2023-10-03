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
        if (isInputInvalid(name) || isInputInvalid(email) || isInputInvalid(password)) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
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

        if (isInputInvalid(email) || isInputInvalid(password)) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'User login successful', user });
        } else {
            return res.status(401).json({ message: 'User not authorized' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};