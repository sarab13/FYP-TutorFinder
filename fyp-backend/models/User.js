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
    }

})

const userModel=mongoose.model('Users',userSchema);
module.exports=userModel;