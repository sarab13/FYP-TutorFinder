const mongoose=require('mongoose')

const bidSchema=new mongoose.Schema({
    price:Number,
    message:String,
    tutorId:String,
    jobId:String
})

const Bid=new mongoose.model('Bids',bidSchema)
module.exports=Bid