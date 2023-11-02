const uuid = require("uuid");
//const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const sequelize = require("../util/database");
var Sib = require("sib-api-v3-sdk");
const User = require("../models/user");
const Forgotpassword = require("../models/forgotpassword");

const dotenv = require("dotenv");
dotenv.config();

const sendResetPasswordEmail = (id) => {
  const Client = Sib.ApiClient.instance;
  var apiKey = Client.authentications["api-key"];
  //console.log(process.env.API_KEY);
  apiKey.apiKey = process.env.API_KEY;
  const sender = {
    email: "srivassaroj39@gmail.com",
  };

  const receivers = [
    {
      email: "sanjeevsrivastava107@gmail.com",
    },
  ];

  const transEmailApi = new Sib.TransactionalEmailsApi();

  const msg = {
    sender,
    to: receivers,
    subject: "Reset Password",
    text: "Reset your password",
    htmlContent: `<a href="http://localhost:8000/password/forgotpassword/${id}">Reset password</a>`,
  };

  return transEmailApi
    .sendTransacEmail(msg)
    .then((resp) => {
      console.log("Email sent successfully:", resp);
      return resp;
    })
    .catch((err) => {
      console.log("Email sending failed:", err);
      return err;
    });
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is missing");
    }
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      await user.createForgotpassword({ id, active: true });
      const restore = await sendResetPasswordEmail(id);
      console.log("Errorrrrrrr", restore);
      if (restore !== undefined) {
        return res.json({
          message: "Link to reset password sent to your email",
          success: true,
        });
      }
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    console.log("First error", err);
    return res.status(500).json({ message: err.message, success: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;

  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.send(`
        <html>
        <script>
        function formsubmitted(e){
            e.preventDefault();
            console.log('called')
        }
    </script>
    <form action="/password/updatepassword/${id}" method="get">
        <label for="newpassword">Enter New password</label>
        <input name="newpassword" type="password" required></input>
        <button>reset password</button>
    </form>
        </html>
      `);
    }
  });
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const resetpasswordid = req.params.id;

    const resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });

    if (!resetpasswordrequest) {
      return res
        .status(404)
        .json({ error: "Forgot password request not found", success: false });
    }

    const user = await User.findOne({
      where: { id: resetpasswordrequest.trackerId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(newpassword, saltRounds);

    await user.update({ password: hash });

    return res
      .status(201)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
