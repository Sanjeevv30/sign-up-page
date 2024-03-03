// const RazorPay = require("razorpay");
// const Order = require("../models/order");
// const userController = require('../controllers/userController')

// const purchasePremium = async (req, res) => {
//   try {
//     var rzp = new RazorPay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });
//     const amount = 2500;
//     rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
//       if (err) {
//         throw new Error(JSON.stringify(err));
//       }
//       req.user
//         .createOrder({ orderId: order.id, status:"PENDING"})
//         .then(() => {
//           return res.status(201).json({ order, key_id: rzp.key_id });
//         })
//         .catch((err) => {
//           throw new Error(err);
//         });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ success : false ,message: " Something went wrong", error: err  });
//   }
// };

// const updateTransactionStatus = async (req, res) => {
//   try {
//     const { payment_id, order_id } = req.body;

//     console.log("order_id:", order_id);

//     const order = await Order.findOne({ where: { orderId: order_id } });
//     const promise1 = order.update({
//       paymentId: payment_id,
//       status: "SUCCESSFUL",
//     });
//     const promise2 = req.user.update({ isPremiumUser: true });
//     Promise.all([promise1, promise2])
//       .then(() => {
//         return res
//           .status(202)
//           .json({ success: true, message: "Transaction Successful",token:userController.generateJWT(req.user.id,undefined,true)});
//       })
//       .catch((err) => {
//         throw new Error(err);
//       });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ error: err, message: "Something went wrong" });
//   }
// };
// module.exports = {
//   purchasePremium,
//   updateTransactionStatus,
// };

const RazorPay = require("razorpay");
const Order = require("../models/order");
const userController = require('../controllers/userController');

const purchasePremium = async (req, res) => {
  try {
    var rzp = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      try {
        const newOrder = await Order.create({ orderId: order.id, user: req.user._id });
        return res.status(201).json({ order, key_id: rzp.key_id });
      } catch (error) {
        throw new Error(error);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ success: false, message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    console.log("order_id:", order_id);

    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentId = payment_id;
    order.status = "SUCCESSFUL";
    await order.save();

    req.user.isPremiumUser = true;
    await req.user.save();

    return res.status(202).json({
      success: true,
      message: "Transaction Successful",
      token: userController.generateJWT(req.user.id, undefined, true)
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus,
};

