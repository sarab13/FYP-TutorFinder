require('./dbConnection')
const express=require('express')
const stripe = require("stripe")("");
const uuid = require("uuid").v4;
const mongoose=require('mongoose')
const User=require('./models/User')
const Admin=require('./models/Admin')
const Profile=require('./models/TeacherProfile')
const StudentProfile=require('./models/StudentProfile')
const TBankDetails=require('./models/TeacherBankDetails')
const SBankDetails=require('./models/StudentBankDetails')
const JobPost=require('./models/JobPost')
const Bid=require('./models/Bid')
const Order=require('./models/Order')
const DirectOrder=require('./models/DirectOrder')
const Payment=require('./models/Payment')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors=require('cors')
const app=express();
const multer=require('multer')

const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const { findOne } = require('./models/User');
const AcademyPayment = require('./models/AcademyPayment');

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

app.post("/checkout", async (req, res) => {
    let error;
    let status;
    try {
      const { product, token } = req.body;
   
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });
   
      const idempotency_key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        {
          idempotency_key,
        }
      );
      let paymentInfo={paymentId:token.card.id,brand:token.card.brand,ownerId:product.ownerId}
      status = "success";
      res.json({status,paymentInfo})
    } catch (error) {
      //console.error("Error:", error);
      status = "failure";
      res.json({status})
    }
   
    
  });

//POST endpoint for Creating order
app.post('/order',async(req,res)=>{
    const {orderInfo,paymentInfo}=req.body;
  //  console.log(paymentInfo)
    try{
        const newOrder=new Order({
          ...orderInfo
        })
        await newOrder.save()
        const newPayment=new Payment({
            paymentInfo:paymentInfo.paymentId,
            brand:paymentInfo.brand,
            ownerId:paymentInfo.ownerId
        })
        await newPayment.save()
        res.json({status:"success"})
    }
    catch(e){
      // console.log(e)
       res.json({status:"failure"})
    }

})  
app.post('/directorder',async(req,res)=>{
  const {orderInfo,paymentInfo}=req.body;
  //console.log(paymentInfo)
  try{
      const newOrder=new DirectOrder({
        ...orderInfo
      })
      await newOrder.save()
      const newPayment=new Payment({
          paymentInfo:paymentInfo.paymentId,
          brand:paymentInfo.brand,
          ownerId:paymentInfo.ownerId
      })
      await newPayment.save()
      res.json({status:"success"})
  }
  catch(e){
     //console.log(e)
     res.json({status:"failure"})
  }
})
app.post('/academypayment',async(req,res)=>{
  const {orderInfo,paymentInfo}=req.body;
 // console.log(paymentInfo)
  try{
    let isExist=await AcademyPayment.findOne({tutor_id:orderInfo.tutor_id})
    if(isExist){
      await AcademyPayment.findByIdAndUpdate({_id:isExist._id},{$push:{subscribers:{
        subscriber_id:orderInfo.student_id,
        start_date:orderInfo.start_date,
        end_date:orderInfo.end_date,
        payment_id:orderInfo.payment_id,
        price:orderInfo.price
      }}})
    }
    else{
      const newOrder=new AcademyPayment({
        tutor_id:orderInfo.tutor_id
      })
      await newOrder.save()
      await AcademyPayment.findByIdAndUpdate({_id:newOrder._id},{$push:{subscribers:{
        subscriber_id:orderInfo.student_id,
        start_date:orderInfo.start_date,
        end_date:orderInfo.end_date,
        payment_id:orderInfo.payment_id,
        price:orderInfo.price
      }}})
    }
      const newPayment=new Payment({
          paymentInfo:paymentInfo.paymentId,
          brand:paymentInfo.brand,
          ownerId:paymentInfo.ownerId
      })
      await newPayment.save()
      res.json({status:"success"})
  }
  catch(e){
    // console.log(e)
     res.json({status:"failure"})
  }
})
app.get('/getsubscribers',async(req,res)=>{
 // console.log("hereeeeee")
  const {tutor_id}=req.query;
  //console.log(tutor_id)
  try{
    const findDetails=await AcademyPayment.findOne({tutor_id})
    let subscribers=[]

    if(findDetails){
    const users=findDetails.subscribers;
    for(let i=0;i<users.length;i++){
      let Subscriber={};
      Subscriber.start_date=users[i].start_date
      Subscriber.end_date=users[i].end_date
      Subscriber.payment_id=users[i].payment_id;
      const user=await User.findOne({_id:users[i].subscriber_id})
      Subscriber.subscriber_id=users[i].subscriber_id;
      Subscriber.username=user.username
      Subscriber.email=user.email
      Subscriber.role=user.role
      subscribers.push(Subscriber)
    }
  }
    res.json({error:false,data:subscribers})
  }
  catch(e){
    //console.log(e)
    res.json({error:true,message:"something went wrong ggg."})
  }
})


app.get('/ispaid',async(req,res)=>{
  const {student_id,tutor_id}=req.query;
  try{
   const isExist=await AcademyPayment.findOne({tutor_id})
   const filtered=isExist.subscribers.filter((user)=>user.subscriber_id==student_id)
   if(filtered.length>0){
    res.json({error:false,message:"success"})
   }
   else{
    res.json({error:false,message:"notexist"})
   }
  }
  catch(e){
   res.json({error:true,message:"failure"})
  }
})
app.post('/stdupdateprofile',upload.single('profileImg'),async(req,res)=>{
  const url = req.protocol + '://' + req.get('host')
  try{
  const profile = new StudentProfile({
      //_id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      profile_pic: url + '/public/' + req.file.filename,
     // description:req.body.description,
      gender:req.body.gender,
      dob:req.body.dob,
      location:req.body.location,
      qualification:req.body.qualification,
      //experience:req.body.experience,
      //fee:req.body.fee,
      studentId:req.body.studentId
  });
  await profile.save()
  
  //await Profile.updateOne({_id:profile._id},{$push:{subjects:{$each:subjects}}})
  
  const newBankDetails=new SBankDetails({
    studentId:req.body.studentId
  })
  await newBankDetails.save()
  res.json({error:false,message:"success",profile})
}
catch(e){
  console.log(e)
  res.json({error:true,message:"Something went wrong, Try again."})
}
})
app.post('/updateprofile', upload.single('profileImg'),async (req, res) => {
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
        qualification:req.body.qualification,
        experience:req.body.experience,
        fee:req.body.fee,
        tutorId:req.body.tutorId
    });
    await profile.save()
    
    await Profile.updateOne({_id:profile._id},{$push:{subjects:{$each:subjects}}})
    const newBankDetails=new TBankDetails({
      tutorId:req.body.tutorId
    })
    await newBankDetails.save()
    res.json({error:false,message:"success",profile})
}
catch(e){
    console.log(e)
    res.json({error:true,message:"Something went wrong, Try again."})
}
})
app.put('/stdeditprofile',upload.single('profileImg'),async(req,res)=>{
  const url = req.protocol + '://' + req.get('host')
//  const {profileId,updatedProfile}=req.body;
 // const subjects=JSON.parse(req.body.subjects)
try{
  const updatedResult=await StudentProfile.findOneAndUpdate({studentId:req.body.studentId},{
    name: req.body.name,
    profile_pic: req.file?url + '/public/' + req.file.filename:req.body.profileImg,
    //description:req.body.description,
    gender:req.body.gender,
    dob:req.body.dob,
    location:req.body.location,
    qualification:req.body.qualification,
    //experience:req.body.experience,
    //fee:req.body.fee,
    studentId:req.body.studentId

  })
  res.json({error:false,message:"success"})
}
catch(e){
  console.log(e)
  res.json({error:true,message:"something went wrong."})
}
})
app.put('/editprofile',upload.single('profileImg'),async(req,res)=>{
  const url = req.protocol + '://' + req.get('host')
//  const {profileId,updatedProfile}=req.body;
  const subjects=JSON.parse(req.body.subjects)
try{
  const updatedResult=await Profile.findOneAndUpdate({tutorId:req.body.tutorId},{
    name: req.body.name,
    profile_pic: req.file?url + '/public/' + req.file.filename:req.body.profileImg,
    description:req.body.description,
    gender:req.body.gender,
    dob:req.body.dob,
    location:req.body.location,
    qualification:req.body.qualification,
    experience:req.body.experience,
    fee:req.body.fee,
    tutorId:req.body.tutorId,
    subjects:[]
  })
  await Profile.findOneAndUpdate({tutorId:req.body.tutorId},{$push:{subjects:{$each:subjects}}})
  //await Profile.updateOne({_id:profile._id},{$push:{subjects:{$each:subjects}}})

  res.json({error:false,message:"success"})
}
catch(e){
  console.log(e)
  res.json({error:true,message:"something went wrong."})
}
})

app.put('/tbankdetails',async(req,res)=>{
  const {tutorId,bankname,accountNo,routingNo,phoneNo,extraDetails}=req.body;
  try{
   const Detail=await TBankDetails.findOne({tutorId})
   await TBankDetails.findByIdAndUpdate({_id:Detail._id},{
    bankname,
    accountNo,
    routingNo,
    phoneNo,
    extraDetails,
    tutorId
   })
   res.json({error:false,message:"success"})

  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.put('/sbankdetails',async(req,res)=>{
  const {studentId,bankname,accountNo,routingNo,phoneNo,extraDetails}=req.body;
  try{
   const Detail=await SBankDetails.findOne({studentId})
   await SBankDetails.findByIdAndUpdate({_id:Detail._id},{
    bankname,
    accountNo,
    routingNo,
    phoneNo,
    extraDetails,
    studentId
   })
   res.json({error:false,message:"success"})

  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.get('/tbankdetails',async(req,res)=>{
  const {tutorId}=req.query;
  try{
  const Detail= await TBankDetails.findOne({tutorId})
  res.json({error:false,Detail})
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.get('/sbankdetails',async(req,res)=>{
  const {studentId}=req.query;
  try{
  const Detail= await SBankDetails.findOne({studentId})
  res.json({error:false,Detail})
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.post('/review', async(req,res)=>{
  const {tutorId,stars,message,studentId,orderId}=req.body;
  
  if(!tutorId || !stars || !message || !studentId || !orderId ){
    res.json({error:true,message:"provide all the details"})
    return
  }
  try{
    let review={
      stars,
      message,
      studentId
    }
    const profile=await Profile.findOne({tutorId})
    await Profile.findByIdAndUpdate({_id:profile._id},{$push:{reviews:review}})
    await Order.findByIdAndUpdate({_id:orderId},{review:{stars,message}})
    res.json({error:false})

  }catch(e){
    console.log(e)
    res.json({error:true,message:"something went wrong"})


  }

})
app.get('/taveragerating',async(req,res)=>{
  const {tutorId}=req.query;
  try{
   const profile=await Profile.findOne({tutorId})
   let sum=0.0;
   for(let i=0;i<profile.reviews.length;i++){
    sum+=profile.reviews[i].stars;
   }
   let avg=sum/profile.reviews.length;
   res.json({error:false,average:avg.toFixed(1)})
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.get('/myreviews',async(req,res)=>{
const {tutorId}=req.query;
try{
  const profile=await Profile.findOne({tutorId})
  let reviewsList=[]
  for(let i=0;i<profile.reviews.length;i++){
    let review={};
    review.stars=profile.reviews[i].stars;
    review.message=profile.reviews[i].message;
    const student=await User.findOne({_id:profile.reviews[i].studentId})
    review.studentName=student.username;
    reviewsList.push(review)
  }
  res.json({error:false,reviews:reviewsList})
}
catch(e){
  res.json({error:true,message:"something went wrong."})
}
})
app.post('/registeradmin',async(req,res)=>{
  const admin=req.body;
  try{
    const takenUsername=await User.findOne({username:admin.username})
    const takenEmail=await User.findOne({email:admin.email})
    if(takenUsername || takenEmail){
        res.json({error:true,message:"Username or Email has already been taken."})
        return
    }
     else{
      const hashedPassword=await bcrypt.hash(admin.password,10);
      const dbUser=new Admin({
          username:admin.username.toLowerCase(),
          email:admin.email.toLowerCase(),
          password:hashedPassword,
      
      })
      dbUser.save();
  
      res.json({error:false,message:"success",user:dbUser})
    }
  }
  catch(e){
    console.log(e)
    res.json({error:true,message:"something went wrong."})
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
app.get('/myproposals',async(req,res)=>{
  const {tutorId}=req.query;
  try{
    let proposalsList=[];
  const myBids=await Bid.find({tutorId})
  for(let i=0;i<myBids.length;i++){
    let proposal={}
    proposal.message=myBids[i].message;
    proposal.price=myBids[i].price;
    const post=await JobPost.findOne({_id:myBids[i].jobId})
    proposal.jobId=post._id;
    proposal.jobTitle=post.title;
    const user=await User.findOne({_id:post.user_id})
    proposal.studentName=user.username;
    proposalsList.push(proposal)

  }
  res.json({error:false,data:proposalsList})
  }
  catch(e){
    res.json({error:true,message:"Something went wrong."})
  }
})
app.post('/loginadmin',async(req,res)=>{
  try{

    const {username,password}=req.body;
    const user=await Admin.findOne({username:username.toLowerCase()});
    if(!user){
        res.json({error:true, message:"Username or Password is incorrect"})
    }
  
    else{
        const correctPassword=await bcrypt.compare(password,user.password);
        if(correctPassword){
            res.json({message:"Login Successfully",user})
        }
        else{
            res.json({error:true, message:"Username or Password is incorrect"})

        }
    }
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.post('/changepassword',async(req,res)=>{
 // const {user}=req.body;
  const {username,password,role,newpassword}=req.body
  console.log(password)
  try{
    let user=await User.findOne({username:username.toLowerCase()});
    if(!user){
      res.json({error:true, message:"Username or Password is incorrect"})
  }
  else if(role!==user.role){
      res.json({error:true, message:"Username or Password is incorrect"})

  }
  else{
      const correctPassword=await bcrypt.compare(password,user.password);
      if(correctPassword){
        if(!user.accountStatus){
          res.json({error:true,message:"Your account is temporarily block"})
          return
        }
        const hashedPassword=await bcrypt.hash(newpassword,10);
        
          await User.findOneAndUpdate({_id:user._id},{password:hashedPassword})     
          res.json({error:false,message:"Password Changed Successfully"})
      }
      else{
          res.json({error:true, message:"Username or Password is incorrect"})

      }
  }
  }
  catch(e){
    res.json({error:true,message:"Something went wrong."})
  }
})
app.post('/login',async(req,res)=>{
    const {username,password,role}=req.body;
    const user=await User.findOne({username:username.toLowerCase()});
    if(!user){
        res.json({error:true, message:"Username or Password is incorrect"})
    }
    else if(role!==user.role){
        res.json({error:true, message:"Username or Password is incorrect"})

    }
    else{
        const correctPassword=await bcrypt.compare(password,user.password);
        if(correctPassword){
          if(!user.accountStatus){
            res.json({error:true,message:"Your account is temporarily block"})
            return
          }
            const token=jwt.sign({_id:user._id},'mysecretstring')
            let userDetail={
              _id:user._id,username:user.username,
            password:user.password,
          role:user.role,
        email:user.email,
      profile_pic:''}
            if(user.role==="STUDENT"){
              const profile=await StudentProfile.findOne({studentId:user._id})
              if(profile) 
              userDetail.profile_pic=profile.profile_pic
            }
            else{
              const profile=await Profile.findOne({tutorId:user._id})
              if(profile)
               userDetail.profile_pic=profile.profile_pic
            }
            res.cookie('token',token)
            res.json({error:false,message:"Login Successfully",user:userDetail})
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
app.post('/stdmyprofile',async(req,res)=>{
  const studentId=req.body.studentId;
  try{
   //  console.log(tutorId)
   const myProfile=await StudentProfile.findOne({studentId})
   res.json({error:false,message:"success",myProfile})
 
  }
  catch(e){
     res.json({error:true,message:'Something went wrong, Try again'})
 
  }
 })
app.post('/myprofile',async(req,res)=>{
 const tutorId=req.body.tutorId;
 try{
    console.log(tutorId)
  const myProfile=await Profile.findOne({tutorId})
  res.json({error:false,message:"success",myProfile})

 }
 catch(e){
    res.json({error:true,message:'Something went wrong, Try again'})

 }
})
app.post('/stdcompleteprofile',async(req,res)=>{
  const studentId=req.body.studentId;
  try{
  const existsProfile=await StudentProfile.findOne({studentId})
  if(existsProfile){
    res.json({message:"success",isComplete:true})
 }
 else{
    res.json({message:"failure",isComplete:false})

 }
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
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
    const Posts=await JobPost.find().sort({_id:-1})
    let myPosts=Posts.filter((post)=>post.user_id==userId)
    myPosts=myPosts.filter((post)=>(post.show==true))
    res.json({message:"success",myPosts})
    }
    catch(e){
      console.log(e)
    res.json({error:true,message:"Something went wrong, try again."})
    }
})
const auth=(req,res,next)=>{

}

app.get('/users',async(req,res)=>{
  console.log(req.query.role)
const {role}=req.query;

  try{   
    let UsersList=[]
    const Users=await User.find({role})
    for(let i=0;i<Users.length;i++){
      let UserObject={}
    let profile;
    if(Users[i].role=='TEACHER')
    profile=await Profile.findOne({tutorId:Users[i]._id})
    else{
      console.log(Users[i]._id)
    profile=await StudentProfile.findOne({studentId:Users[i]._id})
    console.log("hi g")
    console.log(profile)
    }
    UserObject.name=profile.name;
    UserObject.imgUrl=profile.profile_pic;
    UserObject.accountStatus=Users[i].accountStatus;
    UserObject._id=Users[i]._id;

    UsersList.push(UserObject)

    }
    console.log(UsersList)
    res.json({error:false,Users:UsersList})


  }catch(e){
    console.log(e)
    res.json({error:true,message:"Something went wrong"})

  }

  
})
app.post('/toggleaccountstatus',async(req,res)=>{
  const {userId}=req.body;
  try{
  const user=await User.findById({_id:userId})
  await User.findByIdAndUpdate({_id:userId},{accountStatus:!user.accountStatus})
  res.json({error:false,message:"success"})
  }catch(e){
  res.json({error:true})
  }
})

app.get('/pendingpayments',async(req,res)=>{
  try{
    const orders=await Order.find().where('status').in(['complete','cancelled']).where('transfer').in([false])
    const directorders=await DirectOrder.find().where('status').in(['complete','cancelled']).where('transfer').in([false])
    let TotalOrders=[...orders,...directorders]
    let finalArray=[]
    for(let i=0;i<TotalOrders.length;i++){
      let OrderObject={}
      if(TotalOrders[i].status==='cancelled'){
        let bankDetail=await SBankDetails.findOne({studentId:TotalOrders[i].studentId})
        let user=await User.findOne({_id:TotalOrders[i].studentId})
        OrderObject.bankDetail=bankDetail;
        OrderObject.name=user.username
        OrderObject.role=user.role
        OrderObject.payable=TotalOrders[i].price-(TotalOrders[i].price*(5/100))
        OrderObject.status='cancelled'
        OrderObject.transfer=false

      }
      else{
        let bankDetail=await TBankDetails.findOne({tutorId:TotalOrders[i].tutorId})
        let user=await User.findOne({_id:TotalOrders[i].tutorId})
        OrderObject.name=user.username
        OrderObject.role=user.role
        OrderObject.bankDetail=bankDetail;
        OrderObject.payable=TotalOrders[i].price-(TotalOrders[i].price*(15/100))
        OrderObject.status='complete'
        OrderObject.transfer=false
      }
      OrderObject.orderId=TotalOrders[i]._id
      finalArray.push(OrderObject)
    }
    res.json({error:false,finalArray})
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})

app.post('/markaspaid',async(req,res)=>{
  const {orderId}=req.body;
  try{
  await Order.findByIdAndUpdate({_id:orderId},{transfer:true})
  await DirectOrder.findByIdAndUpdate({_id:orderId},{transfer:true})
  res.json({error:false,message:"success"})
  }
  catch(e){
    res.json({error:true,message:"something went wrong."})
  }
})
app.get('/ordersinfo',async(req,res)=>{
try{

  const orders=await Order.find();
  const directorders=await DirectOrder.find();
  const Orders=[...orders,...directorders]
  const completedOrders=Orders.filter((order)=>order.status==="complete")
  const activeOrders=Orders.filter((order)=>order.status==="active")
  const cancelledOrders=Orders.filter((order)=>order.status==="cancelled")
  let OrdersObject={active:{},complete:{},cancel:{}}
  OrdersObject.active.count=activeOrders.length;
  OrdersObject.complete.count=completedOrders.length;
  OrdersObject.cancel.count=cancelledOrders.length;
  OrdersObject.active.priceTotal = activeOrders.reduce((accum,order) => accum + order.price ,0)
  OrdersObject.complete.priceTotal = completedOrders.reduce((accum,order) => accum + order.price ,0)
  OrdersObject.cancel.priceTotal = cancelledOrders.reduce((accum,order) => accum + order.price ,0)

 res.json({error:false,ordersInfo:OrdersObject})

  





}catch(e){
res.json({error:true,message:"Something went wrong."})
}


})
app.post('/deleteaccountstatus',async(req,res)=>{
  const {userId}=req.body;
  try{
  await User.findByIdAndDelete({_id:userId})
  res.json({error:false,message:"success"})
  }catch(e){
  res.json({error:true})
  }
})


app.post('/latest_posts',async(req,res)=>{
    const tutorId=req.body.tutorId;
    const matchedPosts=[]
    const tutor=await Profile.findOne({tutorId})
    const tutorSubjects=tutor.subjects;
    const allPosts=await JobPost.find().sort({_id:-1})
    for(let i=0;i<allPosts.length;i++){
        const postSubjects=allPosts[i].subjects;
        var result = tutorSubjects.filter(function(o1){
          // filter out (!) items in result2
          return postSubjects.some(function(o2){
              return o1.id === o2.id;          // assumes unique id
          });
      })
      if(result.length>0){
        matchedPosts.push(allPosts[i])
      }
    }
    res.json({message:"success",jobs:matchedPosts});



})
app.put('/job',async(req,res)=>{
  const {post}=req.body;
  
  try{
     await JobPost.findByIdAndUpdate({_id:post._id},{
       title:post.title,
       description:post.description,
       budget:post.budget,
       subjects:post.subjects,
       deadline:post.deadline,
       user_id:post.user_id
     })
     res.json({error:false,message:"success"})
  }
  catch(e){
     res.json({error:true,message:"something went wrong, try again."})
  }
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

app.get('/findtutors',async(req,res)=>{
  const {subjectName}=req.query;
  console.log(subjectName)
  try{
    let tutorsList=[]
    const tutors=await User.find({role:'TEACHER'});
    for(let i=0;i<tutors.length;i++){
      let tutorObject={subjects:[]}
      tutorObject._id=tutors[i]._id
      let profile=await Profile.findOne({tutorId:tutors[i]._id})
      let exists=profile.subjects.some(function(subject){
        return subjectName==subject.name
      })
      if(exists){
         tutorObject.name=profile.name;
         tutorObject.profile_pic=profile.profile_pic;
         tutorObject.fee=profile.fee;
         tutorObject.subjects=profile.subjects;
         tutorsList.push(tutorObject)
      }
      
    }
    res.json({error:false,tutorsList})
  }
  catch(e){
    console.log(e)
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
app.put('/updatedirectorderstatus',async(req,res)=>{
  const {order_id,status}=req.body;
  console.log(order_id)
  console.log(status)
  try{
    await DirectOrder.findByIdAndUpdate({_id:order_id},{status})
    res.json({error:false,message:"success"})
  }
  catch(e){
    console.log(e)
    res.json({error:true,message:"Something went wrong, try again."})
  }
})
app.put('/updateorderstatus',async(req,res)=>{
  const {order_id,status}=req.body;
  console.log(order_id)
  console.log(status)
  try{
    await Order.findByIdAndUpdate({_id:order_id},{status})
    res.json({error:false,message:"success"})
  }
  catch(e){
    console.log(e)
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
app.get('/tmydirectorders',async(req,res)=>{
  const {userId}=req.query;
  try{
  const orders=await DirectOrder.find({tutorId:userId});
  let listOfOrders=[];
  for(let i=0;i<orders.length;i++){
    let orderDetail={}
    orderDetail._id=orders[i]._id
    const student=await User.findOne({_id:orders[i].studentId})
    orderDetail.studentId=student._id;
    orderDetail.studentName=student.username;
    orderDetail.orderPrice=orders[i].price;
    orderDetail.orderStatus=orders[i].status;
    listOfOrders.push(orderDetail);
  }
   res.json({message:"success",listOfOrders})
  }
  catch(e){
    console.log(e)
    res.json({message:"failure"})
  }

})
app.get('/mydirectorders',async(req,res)=>{
  const {userId}=req.query;
  try{
  const orders=await DirectOrder.find({studentId:userId});
  let listOfOrders=[];
  for(let i=0;i<orders.length;i++){
    let orderDetail={}
    orderDetail._id=orders[i]._id
    const tutor=await User.findOne({_id:orders[i].tutorId})
    orderDetail.tutorId=tutor._id;
    orderDetail.tutorName=tutor.username;
    orderDetail.orderPrice=orders[i].price;
    orderDetail.orderStatus=orders[i].status;
    listOfOrders.push(orderDetail);
  }
   res.json({message:"success",listOfOrders})
  }
  catch(e){
    console.log(e)
    res.json({message:"failure"})
  }

})
app.get('/tmyorders',async(req,res)=>{
  const {userId}=req.query;
  try{
  const orders=await Order.find({tutorId:userId});
  let listOfOrders=[];
  for(let i=0;i<orders.length;i++){
    let orderDetail={}
    orderDetail._id=orders[i]._id
    orderDetail.review=orders[i].review;
    const student=await User.findOne({_id:orders[i].studentId})
    orderDetail.studentId=student._id;
    orderDetail.studentName=student.username;
    const job=await JobPost.findOne({_id:orders[i].jobId})
    orderDetail.jobId=job._id;
    orderDetail.jobTitle=job.title;
    orderDetail.orderPrice=orders[i].price;
    orderDetail.orderStatus=orders[i].status;
    listOfOrders.push(orderDetail);
  }
   res.json({message:"success",listOfOrders})
  }
  catch(e){
    console.log(e)
    res.json({message:"failure"})
  }

})
app.get('/myorders',async(req,res)=>{
  const {userId}=req.query;
  try{
  const orders=await Order.find({studentId:userId});
  let listOfOrders=[];
  for(let i=0;i<orders.length;i++){
    let orderDetail={}
    orderDetail._id=orders[i]._id
    orderDetail.review=orders[i].review;
    const tutor=await User.findOne({_id:orders[i].tutorId})
    orderDetail.tutorId=tutor._id;
    orderDetail.tutorName=tutor.username;
    const job=await JobPost.findOne({_id:orders[i].jobId})
    orderDetail.jobId=job._id;
    orderDetail.jobTitle=job.title;
    orderDetail.orderPrice=orders[i].price;
    orderDetail.orderStatus=orders[i].status;
    listOfOrders.push(orderDetail);
  }
   res.json({message:"success",listOfOrders})
  }
  catch(e){
    console.log(e)
    res.json({message:"failure"})
  }

})

app.delete('/deletepost',async(req,res)=>{
  const {jobId}=req.query;
  try{
    await JobPost.findByIdAndUpdate({_id:jobId},{show:false})
    res.json({error:false,message:"success"})
  }
  catch(e){
    console.log(e)
    res.json({error:true,message:"failure"})

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
     // console.log("User Joined Room: " + room);
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