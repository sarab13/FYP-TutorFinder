import React,{useEffect} from 'react'
import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import { GoLocation, GoCalendar } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

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

width: 40%;

padding: 20px;
  margin-left: 20px;
  background-color: lightsalmon;

`
const LinkTag=styled(Link)`

width: 40%;

padding: 20px;
  margin-left: 20px;
  background-color: lightsalmon;

`


const Tags=styled.div`
width: 15%;
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

`
const Row=styled.div`

display:flex;
margin-left: 10px;
margin-bottom: 10px;
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
         <Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem><Link to='/findjobs'>Find jobs</Link></MenuItem>
                <MenuItem><Link to='/chat'>Messages</Link></MenuItem>                
                <Button onClick={handleLogout}>Logout</Button>                

            </Menu>
            
            </Left>
            
            
            
            </Wrapper>
        </Container>
        <BottomContainer>
        <Text>Online Tutor Jobs</Text>
        <SearchContainer>
        <Input type="search" placeholder="Subject/Skill"/>
        <Button>Search</Button>

        </SearchContainer>
        
        {jobs.map((job)=>(
          <LinkTag to={`/findjobs/${job._id}`}>
          <ViewPostContainer>
          <Text>
            {job.title}
        </Text>
        {job.subjects.map((Subject)=>(<Tags>{Subject.name}</Tags>))}
        <Desc> {job.description}</Desc>

        <Row>
        <Text> <GoCalendar/> {moment(job.deadline).fromNow()}</Text>
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
