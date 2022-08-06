import React from 'react'
import styled from "styled-components"
import axios from 'axios'
import { useState } from "react";
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { signIn } from '../redux/actions/action';
import { Link } from 'react-router-dom';
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url()
      center;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
font-size: 20px;


margin-top: 10px;
margin-left: 20px;
`
const Row=styled.div`
display: flex;





justify-content: center;
margin-left: 20px;
`
const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  margin-left: 20px;
  background-color: lightgray;


  
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  font-weight: bold;
`;
const RadioTitle=styled.h5`
margin-left: 10px;
margin-right: 10px;
margin-top: 5px;


`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 30%;
  border: none;
  padding: 15px 20px;
  background-color: crimson;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 10px;
  margin-top: 10px;
  
  

`;

const Link1 = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;
const Login = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('')
  const [error,setError]=useState('')
  const handleUsername=(e)=>{
    setError('')
    setUsername(e.target.value)
  }
  const handlePassword=(e)=>{
    setError('')
    setPassword(e.target.value)
  }
  const handleRole=(e)=>{
    setError('')
    setRole(e.target.value)
  }
  const handleSubmit=async(e)=>{
    //alert('button clieck')
    setError('')
    e.preventDefault();
    if(username.length<1 || password.length<1 ||role.length<1){
      setError("Please Enter username and passwords")
      return
    }
    if(username.length<6){
      setError('Username must be at least 6 characters long.')
      return
    }
    if(!(username[0]>='a' && username[0]<='z')){
      setError('Username must start with alphabets.')
      return
    }
    
    if(password.length<6){
      setError("Password must be at least 6 characters long.")
      return
    }
    
    const body={username,password,role}
    
  
  const result=await axios.post('http://localhost:5000/login',body);
  if(result.data.error){
    setError(result.data.message)
  }
  else{
    setError('')
    dispatch(signIn(result.data.user))
    navigate('/')
  }
  }
    return (
      
      <div>
      <Logo>Tutor Finder</Logo>
        <Container>
        
        
        
         <Wrapper>
         
        <Title>SIGN IN</Title>
        <Form>
          <Input type="text" placeholder="username" value={username} onChange={handleUsername}/>
          <Input type="password" placeholder="password" value={password} onChange={handlePassword} />
          
          
          <Row>
          <input type="radio" id="html" name="fav_language" value="STUDENT" onChange={handleRole}></input><br/>
          <RadioTitle>Student</RadioTitle>
          <input type="radio" id="html" name="fav_language" value="TEACHER" onChange={handleRole}></input>
          <RadioTitle>Teacher</RadioTitle>
          </Row>

         
         
          

          <p>{error}</p>
          <Button type='submit' onClick={handleSubmit}>LOGIN</Button>
          <Link1>DO NOT YOU REMEMBER THE PASSWORD?</Link1>
          
          <Link to='/register'>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
      
     
            
        </Container>
        </div>
    )
}

export default Login
