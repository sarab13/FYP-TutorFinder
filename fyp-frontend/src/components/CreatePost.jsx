import React,{useState,useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from "styled-components"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { logoutUser ,toggleProfileStatus} from '../redux/actions/action'
import StudentNavbar from '../components/Student/StudentNavbar'

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

margin-top: 100px;
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



const CreatePost = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const currentUser=useSelector((state)=>state.currentUser)
    const getResult=async()=>{
        const body={studentId:currentUser.user._id}
        const result=await axios.post('/stdcompleteprofile',body)
        console.log(result.data.isComplete)
         if(result.data.isComplete){
            dispatch(toggleProfileStatus(true))
         }
         else{
            navigate('/stdupdateprofile')
         }
        
      }
    useEffect(()=>{
     getResult()
    },[])
    const handleLogout=()=>{
        dispatch(logoutUser())
        navigate('/login')
    }
    if(!currentUser.isLoggedIn){
        return <Navigate to='/login'/>
    }
    else return (
        <div>
       <StudentNavbar/>
        <BottomContainer>
        <Text>you have not created post yet?</Text>

            <PostButton><Link to='/createjob'>Post a requirement</Link></PostButton>
            <Text>or</Text>
            <FindTeachersButton><Link to='/searchtutors'>Find Tutors</Link></FindTeachersButton>
        </BottomContainer>


        
            
        </div>
    )
}

export default CreatePost
