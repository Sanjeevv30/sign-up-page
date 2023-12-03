const uuid = require("uuid");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const User = require("../models/user");
const forgotPasswordHandler = require("../models/forgot-Password");

const dotenv = require("dotenv");
dotenv.config();

const sendResetPasswordEmail = (id) => {
  const Client = Sib.ApiClient.instance;
  var apiKey = Client.authentications["api-key"];
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
    htmlContent: `<a href="http://localhost:8000/forgot-password/${id}">Reset password</a>`,
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is missing");
    }
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      await user.createForgotPassword({ id, active: true });
      const restore = await sendResetPasswordEmail(id);

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

const resetPassword = (req, res) => {
  const id = req.params.id;

  forgotPasswordHandler.findOne({ where: { id } }).then((forgotPasswordRequest) => {
    if (forgotPasswordRequest) {
      forgotPasswordRequest.update({ active: false });
      res.send(`
        <html>
        <script>
        function formSubmitted(e){
            e.preventDefault();
            console.log('called')
        }
    </script>
    <form action="/password/update-password/${id}" method="get">
        <label for="newPassword">Enter New password</label>
        <input name="newPassword" type="password" required></input>
        <button>reset password</button>
    </form>
        </html>
      `);
    }
  });
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.query;
    const resetPasswordId = req.params.id;

    const resetPasswordRequest = await forgotPasswordHandler.findOne({
      where: { id: resetPasswordId },
    });

    if (!resetPasswordRequest) {
      return res
        .status(404)
        .json({ error: "Forgot password request not found", success: false });
    }

    const user = await User.findOne({
      where: { id: resetPasswordRequest.trackerId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ password: hash });

    return res
      .status(201)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = {
  forgotPassword,
  updatePassword,
  resetPassword,
};
