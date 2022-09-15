import React,{useState} from 'react'
import moment from 'moment'
import axios from 'axios';
import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import { GoLocation, GoCalendar } from "react-icons/go";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Navigate,Link } from 'react-router-dom';
import NotificationCenter from 'react-notification-center-component';
import StudentNavbar from "../components/Student/StudentNavbar"
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
font-size: 20px;
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

`
const Button=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-left: 5px;
`
const BottomContainer=styled.div`

margin-top: 50px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;


`

const PostButton=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-top: 20px;

`
const Text=styled.h1`
font-size: 20px;
font-weight:bold;
margin-bottom: 10px;
/*margin-top: 20px;
margin-right: 10px;*/


`
const Text1=styled.h1`
font-size: 12px;
font-weight:bold;
margin-bottom: 10px;
/*margin-top: 20px;
margin-right: 10px;*/


`
const FindTeachersButton=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: green;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-top: 20px;
`
const Input=styled.input`
flex: 1;
  min-width: 100%;

  padding: 10px;


`
const SearchContainer=styled.div`
display: flex;
margin-top: 10px;
margin-bottom: 20px;

`
const ViewPostContainer=styled.div`

width: 100%;

padding: 20px;

  
  margin-top: 20px;

  
  

  

`
const Margin=styled.div`
height: 10px;
width:50%;
background-color: white;

`
const LinkTag=styled.div`

width: 40%;

padding: 20px;
  margin-left: 20px;
  border: 1px solid;
  
  
  background-color: #f0c0c5;
    
  margin-bottom: 20px;
  border-radius: 20px;

`
const Tags=styled.div`
width: 35%;
height: 20px;
background-color: lightgrey;
border-radius: 10px;
padding: 5px,5px;
text-align: center;
margin-bottom: 5px;

margin-top: 5px,

`
const Desc=styled.h5`

font-size: 15px;
margin-top: 20px;
margin-bottom: 20px;
max-height:83px;
overflow:hidden;

`
const Row=styled.div`

display:flex;
margin-left: 10px;

`
const Buttonset=styled.div`
display:flex;
justify-content: space-between;
align-items: center;

`
const Div=styled.div`
display: flex;
justify-content: space-between;
`



export const StudentPosts = () => {
    const currentUser=useSelector((state)=>state.currentUser)
    const [posts,setPosts]=useState([])

    const getPosts=async()=>{
        const result=await axios.post(`/myposts/${currentUser.user._id}`)
        console.log(result)
        setPosts(result.data.myPosts)
    }
    useEffect(()=>{
        getPosts()
    },[])
    const handleDelete=async(jobId)=>{

      const body={jobId};
      const result=await axios.delete(`/deletepost?jobId=${jobId}`,body)
      if(result.data.error){
        alert("error")
      }
      else{
        const updatedPosts=posts.filter((post)=>post._id!==jobId)
        setPosts(updatedPosts)
     
      }
    }
    return (
        <div>
        <StudentNavbar/>
       
        <BottomContainer>
        <Text>My Posts</Text>
        {posts.length<1 ?<p>No More Posts To Show</p>:''}
       {posts && posts.length>0 && posts.map((Post)=>(
       <LinkTag><ViewPostContainer>
<Div>
 <div className="bid_left"><Text>{Post.title}</Text></div>
 
 <div className="bid_right"><Text1>Status:<span className={new Date()>new Date(Post.deadline)?"bidding_status_close":"bidding_status_open"}>{new Date()>new Date(Post.deadline)?'Close':'Open'}</span> </Text1></div></Div>
 {Post.subjects.map((Subject)=>(<Tags>{Subject.name}</Tags>))}
 
 <Desc>{Post.description}</Desc>

 <Row>
 <Text>  {moment(Post.createdAt).fromNow()}</Text>
 
 </Row>
 <Buttonset>

   <Button><Link to={`/myposts/${Post._id}`}>Show more</Link></Button>
   <Div>
   <Button><Link to='/createjob' state={Post._id}>Edit</Link></Button>
   <Button onClick={()=>handleDelete(Post._id)}>Delete</Button>
   </Div>
   


 </Buttonset>


 
 </ViewPostContainer>
 
 

 </LinkTag>

       ))}
       


           
        </BottomContainer>
  


            
        </div>
    )
}
