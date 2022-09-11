const mongoose=require('mongoose');
const reviewSchema=mongoose.Schema({stars:Number,message:String})

const orderSchema=new mongoose.Schema({
    jobId:String,
    studentId:String,
    tutorId:String,
    paymentId:String,
    startTime:Date,
    endTime:Date,
    price:Number,
    status:{
        type:String,
        default:"active"
    },
    review:{
        type:reviewSchema,
    default:null},
    transfer:{
        type:Boolean,
        default:false
    }

})

const Order=new mongoose.model('Order',orderSchema)
module.exports=Order