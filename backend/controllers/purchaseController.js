const Razorpay = require("razorpay");
const Order = require("../models/orders");

const purchasepremium = async (req, res) => {
  try {
    console.log("hello");
    console.log(process.env.RAZORPAY_KEY_ID);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    var rzp = new Razorpay({
      key_id: "rzp_test_6bdV8o4Jp4xCun",
      key_secret: "iOMePGZEySko8OojRcjUtPZG"
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: " Something went wrong", error: err });
  }
};

const updatetransactionstatus = (req,res)=>{
    try{
        console.log("hello 2");
        const{payment_id,order_id} = req.body;
        Order.findOne({where:{orderid:order_id}}).then(order =>{
            order.update({paymentid:payment_id,status:"SUCCESSFUL"}).then(()=>{
                return res.status(202).json({success:true,message :"Transaction Successful"});
            }).catch((err)=>{
                throw new Error(err);
            })
        }).catch((err)=>{
            throw new Error(err);
        })
        }catch(err){
            console.log(err);
        res.status(403).json({error:err,message:'Something went wrong'});
    }
}
module.exports = {
    purchasepremium,
    updatetransactionstatus
};
