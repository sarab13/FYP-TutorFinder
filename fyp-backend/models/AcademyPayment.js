const mongoose=require('mongoose')
const subscribersSchema=new mongoose.Schema({
    subscriber_id:String,
    start_date:Date,
    end_date:Date,
    payment_id:String,
    payment:Number
})
const academyPaymentSchema=new mongoose.Schema({
    subscribers:[subscribersSchema],
    tutor_id:String
})

const AcademyPayment=mongoose.model('AcademyPayment',academyPaymentSchema)
module.exports=AcademyPayment;