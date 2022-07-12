import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import Footer from "./Footer";
import { useSelector } from "react-redux";
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
flex-direction: row;
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
margin-top: 20px;




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
    const getProfileInfo=async()=>{
    const body={tutorId:currentUser.user._id}
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
        getProfileInfo()
    },[])
    if(profile.name.length<1){
        return <p>Loading...</p>
    }
    return (
        <div>

             <Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem>My Jobs</MenuItem>
                <MenuItem>DashBoard</MenuItem>
                <MenuItem>Edit Profile</MenuItem>
                
                

            </Menu>
            
            </Left>
            <Button>Go Premium</Button>
            
            
            </Wrapper>
           
        </Container>
        
        <Name>{profile.name}</Name>
        
        
       
        <BottomContainer>
        
        <Image src={profile.profile_pic} alt="profile" />
        <h3 >{profile.description} </h3>
        

           
        </BottomContainer>
        <Border>____________________________________________________________________________________________________________________________</Border>
        <Row>
        
        <Text> <FcGraduationCap size={30} color="green"/>    Subjects</Text>

         
        </Row>
        <Column>
        {
            profile.subjects.map((subject)=> <Text>{subject.name}</Text>)
        }
       

      

        </Column>
        <Border>____________________________________________________________________________________________________________________________</Border>

        <Row>
        
        <Text> <FcViewDetails size={30} color="green"/>    Experience</Text>

         
        </Row>
        <Column>
            <Text>{profile.experience} years</Text>
        </Column>
        <Border>____________________________________________________________________________________________________________________________</Border>
        <Row>
        
        <Text> <FcBusinessman size={30} color="green"/>    Education</Text>

         
        </Row>
        <Column>
            <Text>{profile.education}</Text>
        </Column>
        <Border>____________________________________________________________________________________________________________________________</Border>
        
        <Row>
        
        <Text> <FcViewDetails size={30} color="green"/>Fee Details</Text>

         
        </Row>
        <Column>
            <Text>{profile.fee} dollar per hour</Text>
        </Column>
        <Footer/>

        </div>
    )
}

export default TeacherProfilePage
