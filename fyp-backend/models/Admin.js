const mongoose=require('mongoose')
const adminSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    admin:String
})

const Admin=new mongoose.model('Admin',adminSchema)
module.exports=Admin