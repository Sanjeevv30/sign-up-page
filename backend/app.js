const express = require('express');
const app = express();


const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const userRouter = require('./routes/userRouter');
const Login = require('./models/logins');
const userController = require('./controllers/userController');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use('/', userRouter);

// app.get('/', (req, res) => {
//     res.send('Server is up and running');
// });
Login.sync();
User.sync();
sequelize.sync()
    .then((result) => {
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
