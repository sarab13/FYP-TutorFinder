const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    jobId:String,
    studentId:String,
    tutorId:String,
    paymentId:String,
    startTime:Date,
    endTime:Date,
    price:Number

})

const Order=new mongoose.model('Order',orderSchema)
module.exports=Order