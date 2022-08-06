const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    studentId:String,
    tutorId:String,
    paymentId:String,
    startTime:Date,
    endTime:Date,
    price:Number,
    status:{
        type:String,
        default:"active"
    }

})

const DirectOrder=new mongoose.model('DirectOrder',orderSchema)
module.exports=DirectOrder