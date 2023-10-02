const User = require('../models/user');
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
exports.createLogin = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const newLogin = await User.create({
            email,
            password
        });
        res.status(201).json({ message: 'User created successfully', user: newLogin });
    }catch(error){
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
