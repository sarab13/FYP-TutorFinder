import axios from 'axios';
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import StripeCheckout from "react-stripe-checkout";
import styled from "styled-components"
import StudentNavbar from "../components/Student/StudentNavbar"

const Container = styled.div`
  
  


  margin-top: 40px;
  display: flex;
  
  align-items: center;
  justify-content: center;
`;
const Wrapper=styled.div`
width: 25%;
  padding: 20px;
  margin-left: 30px;
  background-color: whitesmoke;
  border-radius: 20px;


`
const Content=styled.div`
display: felx;
align-items: center;
justify-content: center;

`
const Input = styled.input`
  flex: 1;
  min-width: 30%;
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
`;
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
font-size: 20px;


margin-top: 10px;
margin-left: 20px;
`
const Button = styled.button`
  width: 50%;
  border: none;
  padding: 15px 20px;
  background-color: crimson;
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 10px;
  margin-top: 10px;
  
  

`
const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  font-weight: bold;
  text-align: center;
`;
export default function OrderCreationForm() {
    let location=useLocation();
    const [endTime,setEndTime]=useState('')
    const [startTime,setStartTime]=useState('')
    const currentUser=useSelector((state)=>state.currentUser)
    const post=location.state[0];
  
    const proposal=location.state[1];
    const [postTitle,setPostTitle]=useState(post)
    const [price,setPrice]=useState(proposal.price)
    const [isPayment,setIsPayment]=useState(false)
    const [error,setError]=useState('')
    const [paymentInfo,setPaymentInfo]=useState({
        paymentId:'',
        brand:'',
        ownerId:''
    })
    const [product,setProduct] = useState({
        name: `${currentUser.user.username} placed order.`,
        price,
        description: `Order Placed for this Job: "${post.title}"`,
        ownerId:currentUser.user._id
      });
    const handleEndTime=(e)=>{
        setEndTime(e.target.value)
        setError('')
    }
    const handlePrice=(e)=>{
        setPrice(e.target.value)
        setProduct({...product,price:e.target.value})
    }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    //if(endTime.length<1){
      // setError("Please set End Time for Order.");
      //  return
    //}
    if(!isPayment){
        setError("Please make payment first.");
        return
    }
    let timeElapsed=Date.now('yy-mm-dd hh-mm-ss')
  let timestamp=new Date(timeElapsed);
  setStartTime(timestamp);
  console.log(paymentInfo)
  const body={
    orderInfo:{
        jobId:post._id,
        studentId:currentUser.user._id,
        tutorId:proposal.tutorId,
        paymentId:paymentInfo.paymentId,
        startTime:timestamp,
        endTime,
        price
    },
    paymentInfo
  }

  const res=await axios.post('/order',body)
  if(res.data.status=="success"){
    alert("Order Created")
  }
  else{
    alert("Problem with Order Creation")
  }
  }

  async function handleToken(token, addresses) {
    const response = await axios.post(
      "http://localhost:3000/checkout",
      { token, product }
    );
    if (response.data.status === "success") {
    let paymentDetails=response.data.paymentInfo;
    setPaymentInfo({...paymentInfo,paymentId:paymentDetails.paymentId,
    brand:paymentDetails.brand,
    ownerId:paymentDetails.ownerId
    })
    setError('')
    setIsPayment(true)

    } else {
      console.log("failure")
    }
  }
 
    return (
    <>
    
    <div className='orderDetails'>
    <StudentNavbar/>
    <Container>
    <Wrapper>
    
    
    <form onSubmit={handleSubmit}>
   
    <label>Job Title:</label><br/>
    


    <Input type='text' disabled value={post.title}/><br/>
    <label>Student Name:</label><br/>
    <Input type='text' disabled value={currentUser.user.username}/><br/>
    <label>Teacher Name: </label><br/>
    <Input type="text" disabled value={proposal.name}/><br/>
    <label>Order Start Date:</label><br/>
    <Input type="text" disabled value="From Now"/><br/>
    <label>Order End Date:</label><br/>
    <Input type="date" value={endTime} onChange={handleEndTime}/><br/>
    <label>Price:</label><br/>
    <Input type="number" value={price} onChange={handlePrice}/><br/>
    
    <div className="form-group container">
        {isPayment?<button>Paid Successfully</button>:
          <StripeCheckout
            className="center"
            stripeKey=""
            token={handleToken}
            amount={product.price * 100}
            name="Pay Now"
            email={currentUser.user.email}
            //billingAddress
            //shippingAddress
          />
    }
        </div>
        <p>{error}</p>
        <Button type="submit" value="Place Order">place order</Button>
    </form>
    
    </Wrapper>
    </Container>
    
    
    </div>
    
   </>  
  )
}