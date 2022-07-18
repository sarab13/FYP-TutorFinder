require('./dbConnection')
const express=require('express')
const mongoose=require('mongoose')
const User=require('./models/User')
const Profile=require('./models/TeacherProfile')
const JobPost=require('./models/JobPost')
const Bid=require('./models/Bid')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors=require('cors')
const app=express();
const multer=require('multer')

const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const { findOne } = require('./models/User')

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use('/public', express.static('public'));

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, '123' + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

app.post('/updateprofile', upload.single('profileImg'),async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    try{
    const subjects=JSON.parse(req.body.subjects)
    console.log(subjects)
    const profile = new Profile({
        //_id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        profile_pic: url + '/public/' + req.file.filename,
        description:req.body.description,
        gender:req.body.gender,
        dob:req.body.dob,
        location:req.body.location,
        ph_no:req.body.ph_no,
        qualification:req.body.qualification,
        experience:req.body.experience,
        fee:req.body.fee,
        tutorId:req.body.tutorId
    });
    await profile.save()
    await Profile.updateOne({_id:profile._id},{$push:{subjects:{$each:subjects}}})

    res.json({message:"success",profile})
}
catch(e){
    console.log(e)
    res.json({error:true,message:"Something went wrong, Try again."})
}
})


app.post('/register',async(req,res)=>{
    const user=req.body;
    console.log(user)
    const takenUsername=await User.findOne({username:user.username})
    const takenEmail=await User.findOne({email:user.email})
    if(takenUsername || takenEmail){
        res.json({error:true,message:"Username or Email has already been taken."})
    }
     else{
        console.log('here')
      const hashedPassword=await bcrypt.hash(user.password,10);
      const dbUser=new User({
          username:user.username.toLowerCase(),
          email:user.email.toLowerCase(),
          password:hashedPassword,
          role:user.role
      })
      dbUser.save();
      const token=jwt.sign({_id:dbUser._id},'mysecretstring')
      res.cookie('token',token)
      res.json({message:"success",user:dbUser})
    }
})

app.post('/login',async(req,res)=>{
    const {username,password,role}=req.body;
    const user=await User.findOne({username});
    console.log(user)
    if(!user){
        res.json({error:true, message:"Username or Password is incorrect"})
    }
    else if(role!==user.role){
        res.json({error:true, message:"Username or Password is incorrect"})

    }
    else{
        const correctPassword=await bcrypt.compare(password,user.password);
        if(correctPassword){
            const token=jwt.sign({_id:user._id},'mysecretstring')
            res.cookie('token',token)
            res.json({message:"Login Successfully",user})
        }
        else{
            res.json({error:true, message:"Username or Password is incorrect"})

        }
    }
})
app.post('/createJob',async(req,res)=>{
    const post=req.body;
  //  console.log(post)
    try{
    const newPost=new JobPost({
        title:post.title,
        description:post.description,
        budget:parseInt(post.budget),
        deadline:post.deadline,
        
        user_id:post.user_id
    })
    await newPost.save()
    await JobPost.updateOne({_id:newPost._id},{$push:{subjects:{$each:post.subjects}}})
    res.json({message:"success",post:newPost})
}catch(e){
    res.json({error:true,message:'Something went wrong, Try again'})
}
})
app.post('/myprofile',async(req,res)=>{
 const tutorId=req.body.tutorId;
 try{
    console.log(tutorId)
  const myProfile=await Profile.findOne({tutorId})
  res.json({message:"success",myProfile})

 }
 catch(e){
    res.json({error:true,message:'Something went wrong, Try again'})

 }
})
app.post('/completeprofile',async(req,res)=>{
    const tutorId=req.body.tutorId;
    console.log(tutorId)
    try{
     const existsProfile=await Profile.findOne({tutorId:tutorId})
     if(existsProfile){
        res.json({message:"success",isComplete:true})
     }
     else{
        res.json({message:"failure",isComplete:false})

     }
    }
    catch(e){
        console.log(e)
        res.json({error:true,message:'Something went wrong, Try again'})

    }
})
app.post('/myposts/:id',async(req,res)=>{
    const userId=req.params.id;
    console.log(userId)
    try{
    const Posts=await JobPost.find()
    const myPosts=Posts.filter((post)=>post.user_id==userId)
    res.json({message:"success",myPosts})
    }
    catch(e){
    res.json({error:true,message:"Something went wrong, try again."})
    }
})
const auth=(req,res,next)=>{

}

app.post('/latest_posts',async(req,res)=>{
    const tutorId=req.body.tutorId;
    const matchedPosts=[]
    const tutor=await Profile.findOne({tutorId})
    const setA=tutor.subjects;
    const allPosts=await JobPost.find()
    for(let n=0;n<allPosts.length;n++){
        let setB=allPosts[n].subjects
        for (let i of setB) {
            let k=0;
            for(let j of setA){
                if(i.name==j.name){
                    matchedPosts.push(allPosts[n])
                    k=1;
                    break;
                }
            }
            if(k===1)
            break;
        }
    }
    res.json({message:"success",jobs:matchedPosts});



})
app.post('/getjob',async(req,res)=>{
    const id=req.body.id;
    try{
      const jobPost=await JobPost.findOne({_id:id})
      res.json({message:"success",job:jobPost})
    }
    catch(e){
        res.json({error:true,message:"Something went wrong, try again."})

    }
})

app.post('/bidonjob',async(req,res)=>{
 const bidDetails=req.body;
 try{
    const newBid=new Bid({
        price:bidDetails.price,
        message:bidDetails.message,
        tutorId:bidDetails.tutorId,
        jobId:bidDetails.jobId
    })
    await newBid.save()
    res.json({message:"success",Bid:newBid})

 }
 catch(e){
    res.json({error:true,message:"Something went wrong, try again."})

 }
})

app.post('/proposalslist',async(req,res)=>{
    const jobId=req.body.jobId;
    console.log(jobId)
    try{
        const bidsList=[]
        let item={}
        const bids=await Bid.find({jobId})
        for(let i=0;i<bids.length;i++){
            item.tutorId=bids[i].tutorId;
            item.price=bids[i].price;
            item.message=bids[i].message;
            const profile=await Profile.findOne({tutorId:bids[i].tutorId})
            item.name=profile.name;
            item.profileId=profile._id
            bidsList.push(item)
        }
        console.log(bidsList)
        res.json({message:"success",bidsList})

    }
    catch(e){
        res.json({error:true,message:"Something went wrong, try again."})

    }
})
const server=app.listen(5000,()=>{
    console.log("server running successfully.")
})



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });