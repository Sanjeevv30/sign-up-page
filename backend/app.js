const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const userRouter = require('./routes/userRouter');

const userController = require('./controllers/userController');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Use bodyParser.urlencoded for parsing application/x-www-form-urlencoded requests
app.use(bodyParser.json());

app.use('/', userRouter); // Mount the userRouter at the root path

// Define a default route for testing purposes
// app.get('/', (req, res) => {
//     res.send('Server is up and running');
// });

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
