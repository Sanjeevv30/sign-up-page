const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/add-user/Signup', userController.createUser);

router.post('/login',userController.createLogin);
router.get('/get-user/signup',userController.getAllUser);

module.exports = router;