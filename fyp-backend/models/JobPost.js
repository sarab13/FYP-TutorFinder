const mongoose=require('mongoose')

const subjectSchema=mongoose.Schema({_id:false,id:Number,name:String})
const jobPostSchema=mongoose.Schema({
    title:String,
    description:String,
    budget:Number,
    subjects:[subjectSchema],
    deadline:Date,
    user_id:String
})

const JobPost=new mongoose.model('JobPosts',jobPostSchema)

module.exports=JobPost