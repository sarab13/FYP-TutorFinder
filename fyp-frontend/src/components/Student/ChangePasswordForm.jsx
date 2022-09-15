import axios from "axios";
import { useState,usEffect, useEffect } from "react";
import styled from "styled-components"
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import StudentNavBar from './StudentNavbar'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import TeacherNavbar from "../Teacher/TeacherNavBar"

//import Logo from '../images/logo_sm.png'

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";


const theme = createTheme();
const ChangePasswordForm = () => {
    const navigate=useNavigate()
  const currentUser=useSelector((state)=>state.currentUser)
  const [error,setError]=useState('')
  const [oldPassword,setOldPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
 

  

  const handleOldPassword=(e)=>{
    setOldPassword(e.target.value)
  }
  const handleNewPassword=(e)=>{
    setNewPassword(e.target.value)
  }
  const handleConfirmPassword=(e)=>{
    setConfirmPassword(e.target.value)
  }
 
  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(oldPassword.length<1 || newPassword.length<1 || confirmPassword.length<1 ){
      setError('Fill all the fields')
      return
    }
    if(newPassword!==confirmPassword){
        setError('New Password should be same')
        return
    }
    alert(oldPassword+' '+newPassword)
    const body={
      username:currentUser.user.username,
      password:oldPassword,
      role:currentUser.user.role,
      newpassword:newPassword,
    
    }
    const result=await axios.post('/changepassword',body)
    console.log(result)
    if(result.data.error){
      setError(result.data.message)
    }
    else{
      setError('')
      navigate('/')
      //dispatch(signIn(result.data.user))
      //navigate('/')
    }
  }
    return (
        <>{currentUser.user.role==="STUDENT"?<StudentNavBar/>:<TeacherNavbar/>}
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
    
            
            <Typography component="h1" variant="h2" style={{marginTop:12}}>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              <Grid item sm={12}>
              <TextField
                InputLabelProps={{style:{fontSize:15}}}
                value={oldPassword}
                margin="normal"
                onChange={handleOldPassword}
                required
                fullWidth
                InputProps={{style:{fontSize:15,width:300}}}
                
                label="Old Password"
                type="password"
                
            
              />
              </Grid>
              </Grid>
              <Grid container spacing={2}>
              <Grid item sm={12}>
               <TextField
                InputLabelProps={{style:{fontSize:15}}}
                value={newPassword}
                margin="normal"
                onChange={handleNewPassword}
                required
                fullWidth
                InputProps={{style:{fontSize:15,width:300}}}
                
                label="New Password:"
                type="password"
                
                
              />
              </Grid>
              </Grid>
              <Grid container spacing={2}>
              <Grid item sm={12}>
              <TextField
                margin="normal"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                
                fullWidth
                InputLabelProps={{style:{fontSize:15}}}
                InputProps={{style:{fontSize:15}}}
                
                label="Confirm New Password"
                type="password"
        
            
              />
              
              </Grid>
              </Grid>

            
              <p>{error}</p>
              <Button
                type="submit"
                fullWidth
                style={{fontSize:20}}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                
              >
               Change Password
              </Button>
              
            </Box>
          </Box>
         
        </Container>
      </ThemeProvider>
</>
    )
}

export default ChangePasswordForm
