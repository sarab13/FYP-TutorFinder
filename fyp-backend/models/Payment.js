const mongoose=require('mongoose');
const paymentSchema=new mongoose.Schema({
    paymentId:String,
    brand:String,
    ownerId:'String'
})

const Payment=new mongoose.model('Payment',paymentSchema);
module.exports=Payment;