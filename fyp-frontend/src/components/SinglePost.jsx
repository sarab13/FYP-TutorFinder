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

const Container=styled.div`
height: 80px;
background-color: lightgrey;

`
const Wrapper=styled.div`
padding: 20px 20px;
display: flex;
justify-content: space-between;
align-items: center;
`
const Left=styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
`
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
font-size:20px;
`
const Menu=styled.ul`
display: flex;
align-items: center;
justify-content: space-between;
list-style: none;
`
const MenuItem=styled.li`
margin-right: 30px;
font-size: 20px;
font-weight: bold;
cursor:pointer;

`
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

<Leftcontainer>
<div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
        </div>

</Leftcontainer>
        

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
{submittedBid.price===undefined?'':<Leftcontainer><div>
  <h2>Submitted Bid Details</h2>
  <h5>Price : {submittedBid.price}</h5>
  <h5>Message: {submittedBid.message}</h5>
  </div> </Leftcontainer> }  


    </div>
  )
}
