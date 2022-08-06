
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
import Logo from '../images/logo_sm.png'
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
import { signIn } from '../redux/actions/action';
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
export default function RegisterPage() {
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
    if(username.length<6){
      setError('Username must be at least 6 characters long.')
      return
    }
    if(!(username[0]>='a' && username[0]<='z')){
      setError('Username must start with alphabets.')
      return
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(mailformat))
    {
      setError("Email format is not valid.")
    return;
    }
    if(password.length<6){
      setError("Password must be at least 6 characters long.")
      return
    }
    if(password!=confirmPassword){
      setError('Password does not match.')
      return
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
        <FormLabel id="demo-row-radio-buttons-group-label" style={{fontSize:20}}>Role:</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel  value="STUDENT" onChange={handleRole}   control={<Radio />} label="Student" />
          <FormControlLabel value="TEACHER" onChange={handleRole} control={<Radio />} label="Tutor"  />
        </RadioGroup>
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
              <Grid container>
                <Grid item xs>
                  <LinkMui href="#" variant="body2" style={{fontSize:15}}>
                    Forgot password?
                  </LinkMui>
                </Grid>
                <Grid item>
                  <LinkMui href="#" variant="body2" style={{fontSize:15}}>
                    {"Don't have an account? Sign Up"}
                  </LinkMui>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright style={{fontSize:15}} sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>     
    )
}
