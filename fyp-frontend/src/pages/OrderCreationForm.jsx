import axios from 'axios';
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import StripeCheckout from "react-stripe-checkout";

export default function OrderCreationForm() {
    let location=useLocation();
    const [endTime,setEndTime]=useState('')
    const [startTime,setStartTime]=useState('')
    const currentUser=useSelector((state)=>state.currentUser)
    const post=location.state[0];
    const proposal=location.state[1];
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
    if(endTime.length<1){
        setError("Please set End Time for Order.");
        return
    }
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
    <h1>Order Details</h1>
    <form onSubmit={handleSubmit}>
    <label>Job Title:</label><br/>
    <input type='text' disabled value={post.title}/><br/>
    <label>Student Name:</label><br/>
    <input type='text' disabled value={currentUser.user.username}/><br/>
    <label>Teacher Name: </label><br/>
    <input type="text" disabled value={proposal.name}/><br/>
    <label>Order Start Date:</label><br/>
    <input type="text" disabled value="From Now"/><br/>
    <label>Order End Date:</label><br/>
    <input type="date" value={endTime} onChange={handleEndTime}/><br/>
    <label>Price:</label><br/>
    <input type="number" value={price} onChange={handlePrice}/><br/>
    <div className="form-group container">
        {isPayment?<button>Paid Successfully</button>:
          <StripeCheckout
            className="center"
            stripeKey="pk_test_51LPIPuIilE8N6gbW5nT5MVVlRmTOkAz2TzCorb8n6g7ejf0U74H7FJKxZ9xirGc0N0KprjzBv29NvSmhK4pEStXu00B5v7NqRb"
            token={handleToken}
            amount={product.price * 100}
            name="Sample Book"
            email={currentUser.user.email}
            //billingAddress
            //shippingAddress
          />
    }
        </div>
        <p>{error}</p>
        <input type="submit" value="Place Order"></input>
    </form>
    </div>
   </>  
  )
}
