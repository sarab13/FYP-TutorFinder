const mongoose=require('mongoose')
const subjectSchema=mongoose.Schema({_id:false,id:Number,name:String})
const reviewSchema=mongoose.Schema({stars:Number,message:String,studentId:String})

const profileSchema=new mongoose.Schema({
    profile_pic:String,
    name:String,
    description:String,
    gender:String,
    dob:Date,
    subjects:[subjectSchema],
    location:String,
    ph_no:String,
    qualification:String,
    experience:String,
    fee:Number,
    reviews:[reviewSchema],
    tutorId:{
        type:String,
        required:true
    }
})

const Profile=new mongoose.model('TeacherProfiles',profileSchema)

module.exports=Profile;