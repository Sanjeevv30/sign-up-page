const express = require('express');
const app = express();
const Expense = require("./models/expense");
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const userRouter = require('./routes/userRouter');
const Login = require('./models/logins');
const userController = require('./controllers/userController');
const expense = require("./models/expense");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


// app.use((req,res,next)=>{
//     User.findByPk(1)
//     .then(user =>{
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err))
//   })

  app.use('/', userRouter);

  User.hasMany(Expense);
Expense.belongsTo(User);

//     constraints: true,
//     onDelete: "CASCADE"
// });


// Expense.sync();
//Login.sync();
// User.sync();
sequelize.sync()
    .then((result) => {
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
