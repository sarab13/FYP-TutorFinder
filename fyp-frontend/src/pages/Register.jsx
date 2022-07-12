import axios from "axios";
import { useState } from "react";
import styled from "styled-components"
import { signIn } from "../redux/actions/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Row=styled.div`
display: flex;
align-items: center;
margin-top: 20px;



justify-content: center;
margin-left: 20px;
`

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
  align-items: center;
  justify-content: center;
  display: flex;
  
  
  position: relative;
`;
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;

position: absolute;
margin-top: 10px;
margin-left: 20px;
`

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  margin-bottom: 150px;
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


`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 20%;
  border: none;
  padding: 15px 20px;
  background-color: crimson;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 10px;
  
  
`;

const Register = () => {
  const [error,setError]=useState('')
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [role,setRole]=useState('')
  const dispatch=useDispatch()
  const navigate=useNavigate()
 
  const handleUsername=(e)=>{
    setUsername(e.target.value)
  }
  const handleEmail=(e)=>{
    setEmail(e.target.value)
  }
  const handlePassword=(e)=>{
    setPassword(e.target.value)
  }
  const handleConfirmPassword=(e)=>{
    setConfirmPassword(e.target.value)
  }
  const handleRole=(e)=>{
    setRole(e.target.value)
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(username.length<1 || password.length<1 || confirmPassword.length<1 || email.length<1 || role.length<1){
      setError('Fill all the fields')
      return
    }
    if(!password.localeCompare(confirmPassword)){
      setError('Password does not match')
    }
    setError('')

    const body={
      username,
      email,
      password,
      role
    }
    const result=await axios.post('http://localhost:5000/register',body)
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
            <Title>CREATE AN ACCOUNT</Title>
       
        <Form>
          
          <Input placeholder="username" value={username} onChange={handleUsername} />
          <Input placeholder="email" value={email} onChange={handleEmail}/>
          <Input placeholder="password" value={password} onChange={handlePassword}/>
          <Input placeholder="confirm password" value={confirmPassword} onChange={handleConfirmPassword}/>
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          
          <input type="radio" id="html" name="fav_language" onChange={handleRole} value="STUDENT"></input><br/>
          <RadioTitle>Student</RadioTitle>
         
          <input type="radio" id="html" name="fav_language" onChange={handleRole} value="TEACHER"></input>
          <RadioTitle>Teacher</RadioTitle>
          <p>{error}</p>
          <Button onClick={handleSubmit}>Register</Button>
        </Form>
      </Wrapper>
        </Container>
        </div>
    )
}

export default Register
