import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
export default function MyOrders() {
    const currentUser=useSelector((state)=>state.currentUser)
    const [orders,setOrders]=useState([{}])

    const getOrders=async()=>{
        const result=await axios.get(`/myorders?userId=${currentUser.user._id}`)
        setOrders(result.data.listOfOrders)
    }
    useEffect(()=>{
        getOrders()
    },[])

    const handleUpdate=async(order_id,status)=>{
        const res=await axios.put("/updateorderstatus",{order_id,status})
        const result=await axios.get(`/myorders?userId=${currentUser.user._id}`)
        setOrders(result.data.listOfOrders)
    }
  return (
    <>
    {orders.length>0? orders.map((order)=><div className='ordersDiv'>
        <div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>{order.jobTitle}</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        <div>
        {order.status==="active"?<div><button onClick={()=>handleUpdate(order._id,"cancelled")}>Cancel</button>
            <button onClick={()=>handleUpdate(order._id,"complete")}>Mark as complete</button></div>:<button disabled>{order.orderStatus}</button>}</div>
    </div>) : ''}
  </>
  )
}
