const mongoose=require('mongoose')

const bankDetailsSchema=new mongoose.Schema({
    bankname:{
        type:String,
        default:''
    },
    accountNo:{
        type:String,
        default:''
    },
    routingNo:{
        type:String,
        default:''
    },
    phoneNo:{
        type:String,
        default:''
    },
    extraDetails:{
        type:String,
        default:''},
    tutorId:String
})

const TeacherBankDetails=new mongoose.model('TBankDetails',bankDetailsSchema)
module.exports=TeacherBankDetails