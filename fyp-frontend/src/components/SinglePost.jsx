import React from 'react'
import { useParams } from 'react-router-dom'
import styled from "styled-components"
import { Link , useLocation} from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios, { Axios } from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { saveBidDetails } from '../redux/actions/action'
import TeacherNavBar from '../components/Teacher/TeacherNavBar'
import{MdPostAdd} from "react-icons/md"
import moment from 'moment'
import{BsCurrencyDollar ,BsGenderAmbiguous} from "react-icons/bs"




const Leftcontainer=styled.div`

margin-top: 20px;
width:400px;
background-color: #f0c0c5;
margin-left: 20px;
border-radius: 20px;
margin-right: 200px;
padding: 20px;
margin-bottom: 20px;
`
const Rightcontainer=styled.div`

margin-top: 20px;
width:400px;
background-color: #f0c0c5;
margin-left: 20px;
border-radius: 20px;
margin-right: 200px;
padding: 20px;
margin-bottom: 20px;
height: auto;

`
const BottomContainer=styled.div`

margin-top: 50px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

`
const Text1=styled.h1`
font-size: 15px;
margin-top: 10px;
margin-right: 10px;
font-weight:bold;


`
const ViewPostContainer=styled.div`

width: 100%;
margin-top: 10px;




padding: 20px;
  margin-left: 20px;
  

`
const Tags=styled.div`

height: 30px;
background-color: lightgrey;

padding-left: 10px;
padding-right: 10px;
text-align: center;
margin-top: 5px;
margin-left: 10px;
border-radius:10px;

`
const Row=styled.div`

display:flex;
margin-left: 10px;
margin-bottom: 10px;
`
const Text=styled.h1`
font-size: 16px;

margin-bottom: 10px;
/*margin-top: 20px;
margin-right: 10px;*/


`
const Box=styled.div`
display: flex;

`
const Span=styled.span`
font-weight: bold;
`
export default function SinglePost() {
  const dispatch=useDispatch()
  const currentUser=useSelector((state)=>state.currentUser)
  const Bids=useSelector((state)=>state.Bids)
const [price,setPrice]=useState(0)
const [isSubmit,setIsSubmit]=useState(false)

const [isDisable,setIsDisable]=useState(false)
const [resMessage,setResMessage]=useState('')
const [message,setMessage]=useState('')
const [buttonTitle,setButtonTitle]=useState('Bid On Job')
const [submittedBid,setSubmittedBid]=useState({})
const {id}=useParams()
const [user_id,setUserId]=useState('')
const [post,setPost]=useState({

    title:'',
    subjects:[],
    description:'',
    deadline:'',
    budget:0
})

const getJob=async()=>{
const body={id}
const result=await axios.post('/getjob',body)
setPost({...post,
title:result.data.job.title,
subjects:result.data.job.subjects,
description:result.data.job.description,
deadline:result.data.job.deadline,
budget:result.data.job.budget
})
setUserId(result.data.job.user_id)
}
useEffect(()=>{
  getJob()
},[])

useEffect(()=>{
for(let i=0;i<Bids.myBids.length;i++){
if(Bids.myBids[i].jobId==id && Bids.myBids[i].tutorId==currentUser.user._id ){
  setIsDisable(true)
  setButtonTitle('Applied!')
  setSubmittedBid(Bids.myBids[i])
  break;
}
}
},[])



const handlePrice=(e)=>{
  setPrice(e.target.value)
}
const handleMessage=(e)=>{
  setMessage(e.target.value)
}
const handleSubmit=async(e)=>{
  e.preventDefault()
  const body={
    price,
    message,
    tutorId:currentUser.user._id,
    jobId:id
  }
  const result=await axios.post('/bidonjob',body)
  if(result.data.message==='success'){
    dispatch(saveBidDetails(result.data.Bid))
    setResMessage("Bid Successfully Submitted!")
    setIsSubmit(true)
    setIsDisable(true)
    setSubmittedBid(result.data.Bid)
    setButtonTitle("Applied!")
    
    let endpoint = 'https://api.ravenhub.io/company/6Z6EkKF28O/subscribers/'
               + user_id + '/events/8iTWTCXsML';
 
const result2 =await axios.post(endpoint, { "teacher" : currentUser.user.username,"jobId":id }, {
 headers: {'Content-type': 'application/json'}
});
console.log(result2)
  }
  else{
    setResMessage("Something Went Wrong, Please try again.")
    setIsSubmit(true)
  }
}
  return (
    <div>

<TeacherNavBar/>
<Box>
<Leftcontainer>
<BottomContainer>
        <Text1>{post.title}</Text1>
        <ViewPostContainer>
        
        <Row>
        <Tags>Physics</Tags>
        <Tags>Applied physics</Tags>

        </Row>
        <Row>
      
        <BsCurrencyDollar/> <Text>  <span className="text">Amount:</span> {post.budget}</Text>




        </Row>
        <Row>
        <MdPostAdd/> <Text>  <span className="text">Posted:</span>{moment(post.deadline).fromNow()}</Text>
        




        </Row>
       
        <Text>
        {post.description}


        </Text>

        



        </ViewPostContainer>
       
        </BottomContainer>


</Leftcontainer>
{submittedBid.price===undefined?'':<Rightcontainer><div>
  <h2 style={{textAlign:'center',fontWeight:'bold'}}>Submitted Bid Details</h2>
  <h5><Span>Price:</Span>{submittedBid.price}</h5>
  <h5><Span>Message:</Span> {submittedBid.message}</h5>
  </div> </Rightcontainer> } 
  </Box>
        

        <div class="container">
  
  <button type="button" disabled={(new Date()>new Date(post.deadline)) || isDisable?true:false} class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">{(new Date()>new Date(post.deadline))&& !isDisable?"Time Over":buttonTitle}</button>

  
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">
    
  
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Bid Details</h4>
        </div>
        <div class="modal-body">
          {isSubmit?resMessage:<form>
            <label>Your Price:</label><br/>
            <input type='number' value={price} onChange={handlePrice}></input><br/>
            <label>Message:</label><br/>
            <textarea rows="8" cols="65" value={message} onChange={handleMessage}></textarea>
            <input type='submit' value="Submit" onClick={handleSubmit}></input>
            
          </form>}
        </div>
       
      </div>
      
    </div>
  </div>
  
</div>
 


    </div>
  )
}
