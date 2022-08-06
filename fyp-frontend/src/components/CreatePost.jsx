import React,{useState,useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from "styled-components"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../redux/actions/action'
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

    const handleLogout=()=>{
        dispatch(logoutUser())
        navigate('/login')
    }
    if(!currentUser.isLoggedIn){
        return <Navigate to='/login'/>
    }
    else return (
        <div>
        <Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem><Link to='/myposts'>My Posts</Link></MenuItem>
                <MenuItem>Find Tutors</MenuItem>
                <MenuItem><Link to='/chat'>Messages</Link></MenuItem>
                
                

            </Menu>
            
            </Left>
            <Button onClick={handleLogout}>Logout</Button>
            
            
            </Wrapper>
        </Container>
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
