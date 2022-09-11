const mongoose=require('mongoose');
const reviewSchema=mongoose.Schema({stars:Number,message:String})

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
    },
    review:{
        type:reviewSchema,
    default:null},
    transfer:{
        type:Boolean,
        default:false
    }

})

const DirectOrder=new mongoose.model('DirectOrder',orderSchema)
module.exports=DirectOrder