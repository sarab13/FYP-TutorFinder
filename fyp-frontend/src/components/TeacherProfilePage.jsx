import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import Footer from "./Footer";
import { useSelector ,useDispatch} from "react-redux";
import {useNavigate, Link,useLocation} from 'react-router-dom'
import { logoutUser } from '../redux/actions/action';
import TeacherNavBar from '../components/Teacher/TeacherNavBar'
import StudentNavBar from '../components/Student/StudentNavbar'

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
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
width: 60%;
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
`
const BottomContainer=styled.div`

margin-top: 50px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 10px,20px;
margin-left: 10px;
`
const Name=styled.div`
font-size: 20px;
margin-top: 20px;
text-align: center;
font-weight: bold;

`
const Image=styled.img`
width: 200px;
height: 200px;
object-fit: cover;
margin-right: 10px;



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






`
const Text1=styled.h1`
font-size: 20px;
margin-top: 10px;
margin-bottom: 10px;
margin-left: 30px;






`
const Row=styled.div`
display: flex;
margin-left: 100px;
`
const Column=styled.div`
display: flex;
flex-direction: column;
margin-left: 100px;
`
const Border=styled.div`
height: 10px;
width: 10px;
color: gray;
margin-left: 40px;
`

const TeacherProfilePage = () => {
    let location=useLocation()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const currentUser=useSelector((state)=>state.currentUser)
    const [profile,setProfile]=useState({
        description:'',
        dob:'',
        experience:'',
        fee:0,
        gender:'',
        location:'',
        name:'',
        ph_no:'',
        profile_pic:'',
        qualification:'',
        subjects:[]
    })
    const handleLogout=()=>{
        dispatch(logoutUser())
        navigate('/login')
    }
    const getProfileInfo=async(tutorId)=>{
    const body={tutorId}
     const myProfile=await axios.post('/myprofile',body)
     setProfile({
        ...profile,
        description:myProfile.data.myProfile.description,
        dob:myProfile.data.myProfile.dob,
        experience:myProfile.data.myProfile.experience,
        fee:myProfile.data.myProfile.fee,
        gender:myProfile.data.myProfile.gender,
        location:myProfile.data.myProfile.location,
        name:myProfile.data.myProfile.name,
        ph_no:myProfile.data.myProfile.ph_no,
        profile_pic:myProfile.data.myProfile.profile_pic,
        qualification:myProfile.data.myProfile.qualification,
        subjects:myProfile.data.myProfile.subjects
     })
     console.log(profile.subjects)
    }
    useEffect(()=>{
        //alert(location.state)
        if(location.state==null)
        getProfileInfo(currentUser.user._id)
        else
        getProfileInfo(location.state._id)
    },[])
    if(profile.name.length<1){
        return <p>Loading...</p>
    }
    return (
        <div>
            {currentUser.user.role==="STUDENT"?<StudentNavBar/>:<TeacherNavBar/>}

        
        
        
       
        <BottomContainer>
        <Name>{profile.name}</Name>

        {currentUser.user.role=="STUDENT"?
        <div>
           <Button><Link to='/chat' state={location.state._id}>Message Now</Link> </Button> 
            <Button><Link to='/directorder' state={location.state}>Order Now</Link></Button>
        </div>:''
        }
        <Image src={profile.profile_pic} alt="profile" />
        <Text1>{profile.description} </Text1>
        
        

           
        </BottomContainer>
        
        
        <Row>
        
        <FcGraduationCap size={30} color="green" /> 
        <Text> Subjects</Text>
        

         
        </Row>
        <Column>
        {
            profile.subjects.map((subject)=> <Text1>{subject.name}</Text1>)
        }
        <h1>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</h1>
       

      

        </Column>

        <Row>
        <FcViewDetails size={30} color="green"/> 
        <Text>Experience</Text>

         
        </Row>
        <Column>
            <Text1>{profile.experience}  years</Text1>
            <h1>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</h1>

        </Column>
        
        <Row>
        <FcBusinessman size={30} color="green"/>  
        <Text>Education</Text>


         
        </Row>
        <Column>
            <Text1>{profile.qualification}</Text1>
            
            <h1>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</h1>

        </Column>
        
        <Row>
        <FcViewDetails size={30} color="green"/>
        <Text>Fee Details</Text>

         
        </Row>
        <Column>
            <Text1>{profile.fee} dollar per hour</Text1>
        </Column>
        <Footer/>

        </div>
    )
}

export default TeacherProfilePage
