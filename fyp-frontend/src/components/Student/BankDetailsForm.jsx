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

//import Logo from '../images/logo_sm.png'

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";


const theme = createTheme();
const BankDetailsForm = () => {
    const navigate=useNavigate()
  const currentUser=useSelector((state)=>state.currentUser)
  const [error,setError]=useState('')
  const [phoneNo,setPhoneNo]=useState('')
  const [bankname,setBankname]=useState('')
  const [accountNo,setAccountNo]=useState('')
  const [routingNo,setRoutingNo]=useState('')
  const [extraDetails,setExtraDetails]=useState('')

  
  const getDetails=async()=>{
    const result=await axios.get(`/sbankdetails?studentId=${currentUser.user._id}`)
    
    if(!result.data.error){
        const {bankname,accountNo,routingNo,phoneNo,extraDetails}=result.data.Detail;
        setBankname(bankname);
        setAccountNo(accountNo)
        setRoutingNo(routingNo)
        setPhoneNo(phoneNo)
        setExtraDetails(extraDetails)
    }
  }
  useEffect(()=>{
    getDetails()
  },[])
  const handleBankname=(e)=>{
    setBankname(e.target.value)
  }
  const handleAccountNo=(e)=>{
    setAccountNo(e.target.value)
  }
  const handleRoutingNo=(e)=>{
    setRoutingNo(e.target.value)
  }
  const handleExtraDetails=(e)=>{
    setExtraDetails(e.target.value)
  }
  const handlePhoneNo=(e)=>{
    setPhoneNo(e.target.value)
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(bankname.length<1 || accountNo.length<1 ){
      setError('Fill all the fields')
      return
    }
    
    const body={
      bankname,
      accountNo,
      routingNo,
      phoneNo,
      extraDetails,
      studentId:currentUser.user._id
    }
    const result=await axios.put('/sbankdetails',body)
    console.log(result)
    if(result.data.error){
      setError(result.data.message)
    }
    else{
      setError('')
      navigate('/myposts')
      //dispatch(signIn(result.data.user))
      //navigate('/')
    }
  }
    return (
        <><StudentNavBar/>
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
              Bank Details
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              <Grid item md={6}>
              <TextField
                InputLabelProps={{style:{fontSize:15}}}
                value={bankname}
                margin="normal"
                onChange={handleBankname}
                required
                fullWidth
                InputProps={{style:{fontSize:15,width:300}}}
                
                label="Bank Name"
                name="bankname"
                
            
              />
              </Grid>
              <Grid item md={6}>
               <TextField
                InputLabelProps={{style:{fontSize:15}}}
                value={accountNo}
                margin="normal"
                onChange={handleAccountNo}
                required
                fullWidth
                InputProps={{style:{fontSize:15,width:300}}}
                
                label="Account No (IBAN):"
                
                
              />
              </Grid>
              </Grid>
              <Grid container spacing={2}>
              <Grid item md={6}>
              <TextField
                margin="normal"
                value={routingNo}
                onChange={handleRoutingNo}
                
                fullWidth
                InputLabelProps={{style:{fontSize:15}}}
                InputProps={{style:{fontSize:15}}}
                
                label="Routing No."
                type="Number"
        
            
              />
              </Grid>
              <Grid item md={6}>
              <TextField
                margin="normal"
                value={phoneNo}
                onChange={handlePhoneNo}
                required
                fullWidth
                InputLabelProps={{style:{fontSize:15}}}
                InputProps={{style:{fontSize:15}}}
                label="Phone No:"
                type="Number"
                
            
                
              />
              </Grid>
              </Grid>
              <Grid item md={12}>
              <TextField
                margin="normal"
                value={extraDetails}
                onChange={handleExtraDetails}
            
                fullWidth
                InputLabelProps={{style:{fontSize:15}}}
                InputProps={{style:{fontSize:15}}}
                label="Extra Details:"
                type="text"
                    multiline
                rows={3}
                
    
              />
              </Grid>
              <p>{error}</p>
              <Button
                type="submit"
                fullWidth
                style={{fontSize:20}}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                
              >
               Update Details
              </Button>
              
            </Box>
          </Box>
         
        </Container>
      </ThemeProvider>
</>
    )
}

export default BankDetailsForm
