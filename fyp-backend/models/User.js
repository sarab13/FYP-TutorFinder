const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    role:{
        type:String
    },
    accountStatus:{
        type:Boolean,
        default:true,
    }


})

const userModel=mongoose.model('User',userSchema);
module.exports=userModel;