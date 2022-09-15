import React,{useEffect} from 'react'
import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import { GoLocation, GoCalendar } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import TeacherNavBar from './Teacher/TeacherNavBar'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser, toggleProfileStatus } from '../redux/actions/action';
import axios from 'axios'
import { Link} from 'react-router-dom';
import { useState } from 'react';
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
cursor:pointer;

`
const Button=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
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
margin-top: 20px;
margin-right: 10px;



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



padding: 20px;
  margin-left: 20px;
  
  border-radius: 20px;

`
const LinkTag=styled(Link)`

width: 40%;

padding: 10px;
  margin-left: 20px;
  background-color: #f0c0c5;
  margin-bottom: 20px;
  border-radius: 20px;
  

`


const Tags=styled.div`
width: 20%;
height: 20px;
background-color: lightgrey;
border-radius: 10px;
padding: 5px,5px;
text-align: center;
margin-top: 5px;
`
const Desc=styled.h5`

font-size: 15px;
margin-top: 10px;
max-height:83px;
overflow:hidden;
`
const Row=styled.div`

display:flex;
margin-left: 10px;
margin-bottom: 10px;
`

const Div=styled.div`
display: flex;
justify-content: space-between;
`
const Text1=styled.h1`
font-size: 12px;
font-weight:bold;



`

const TeacherView = () => {
    const currentUser=useSelector((state)=>state.currentUser)
    const [jobs,setJobs]=useState([])
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const getResult=async()=>{
        const body={tutorId:currentUser.user._id}
        const result=await axios.post('/completeprofile',body)
        console.log(result.data.isComplete)
         if(result.data.isComplete){
            dispatch(toggleProfileStatus(true))
         }
         else{
            navigate('/updateprofile')
         }
        
      }
      useEffect(()=>{
        
      getResult();
      },[])

    const getPosts=async()=>{
        const body={tutorId:currentUser.user._id}
        const result=await axios.post(`/latest_posts/`,body)

        setJobs(result.data.jobs)
    }
    useEffect(()=>{
        getPosts()
    },[])



      const profileStatus=useSelector(state=>state.tProfileStatus)
     const handleLogout=()=>{
         dispatch(logoutUser())
         navigate('/login')
     }
    //if(!profileStatus.isCompleteProfile){
    //    return <Navigate to='/updateprofile'/>
    //}
    return (
        <div>
       <TeacherNavBar/>
        <BottomContainer>
        <Text>Online Tutor Jobs</Text>
        {/*<SearchContainer>
        <Input type="search" placeholder="Subject/Skill"/>
        <Button>Search</Button>

        </SearchContainer>*/}
        
        {jobs.map((job)=>(
          <LinkTag to={`/findjobs/${job._id}`}>
          <ViewPostContainer>
          <Div>
 <div className="bid_left"><Text>{job.title}</Text></div>
 
 <div className="bid_right1"><Text1>Status:<span className={new Date()>new Date(job.deadline)?"bidding_status_close":"bidding_status_open"}>{new Date()>new Date(job.deadline)?'Close':'Open'}</span> </Text1></div></Div>
        {job.subjects.map((Subject)=>(<Tags>{Subject.name}</Tags>))}
        <Desc> {job.description}</Desc>

        <Row>
        <Text>  {moment(job.createdAt).fromNow()}</Text>
        {//<Text> <GoLocation/>  Lahore</Text>
        }




        </Row>
        <Button>See More</Button>
        </ViewPostContainer>
       </LinkTag>
        ))}
        





      


           
        </BottomContainer>
  


        
            
        </div>
    )
}

export default TeacherView
