import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormHelperText } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Logo from '../../images/logo_sm.png'
import LinkMui from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { useState } from "react";
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../redux/actions/action';
import { Link } from 'react-router-dom';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <LinkMui color="inherit" href="https://mui.com/">
        Tutor Finder
      </LinkMui>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
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
    

    setError('')
    e.preventDefault();
    if(username.length<1 || password.length<1 ){
      setError("Please Enter username and passwords")
      return
    }
    //if(username.length<6){
      //setError('Username must be at least 6 characters long.')
      //return
    //}
    if(!((username[0]>='a' && username[0]<='z' )||(username[0]>='A' && username[0]<='Z' ) )) {
      setError('Username must start with alphabets.')
      return
    }
    
    //if(password.length<6){
      //setError("Password must be at least 6 characters long.")
      //return
   // }
    
    const body={username,password}
    
  
  const result=await axios.post('http://localhost:5000/loginadmin',body);
  if(result.data.error){
    setError(result.data.message)
    alert(error)
  }
  else{
    setError('')
    dispatch(signIn(result.data.user))
    navigate('/dashboard')
  }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
            <img src={Logo} alt="logo" />
          
          <Typography component="h1" variant="h2" style={{marginTop:20}}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              InputLabelProps={{style:{fontSize:20}}}
              value={username}
              margin="normal"
              onChange={handleUsername}
              required
              fullWidth
              InputProps={{style:{fontSize:20}}}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              value={password}
              onChange={handlePassword}
              required
              fullWidth
              InputLabelProps={{style:{fontSize:20}}}
              InputProps={{style:{fontSize:20}}}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
             <FormControl>

      <FormHelperText  style={{color:'#d32f2f',fontSize:16}}>{error}</FormHelperText>
    </FormControl>
            <Button
              type="submit"
              fullWidth
              style={{fontSize:20}}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
          </Box>
        </Box>
        <Copyright style={{fontSize:15}} sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}