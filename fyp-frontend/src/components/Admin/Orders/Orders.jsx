import './orders.css'
import React,{useState,useEffect} from 'react'
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import  AdminNavbar from '../AdminNavbar';
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function Orders() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pendingPayments,setPendingPayments]=useState([])
    const [orderInfo,setOrdersInfo]=useState({
        active:{
            priceTotal:0,
            count:0,
        },
        complete:{
            priceTotal:0,
            count:0,
        },
        cancell:{
            priceTotal:0,
            count:0,
        }

    })


    const getOrdersInfo=async()=>{
        const result=await axios.get('/ordersinfo')
        if(!result.data.error){
            const {ordersInfo}=result.data;
            setOrdersInfo({
                ...orderInfo,
                active:{
                    priceTotal:ordersInfo.active.priceTotal,
                    count:ordersInfo.active.count
                },
                complete:{
                    priceTotal:ordersInfo.complete.priceTotal,
                    count:ordersInfo.complete.count
                },
                cancell:{
                    priceTotal:ordersInfo.cancel.priceTotal,
                    count:ordersInfo.cancel.count
                },
            })
        }

    }

  const getPendingPayments=async()=>{
    const result=await axios.get('/pendingpayments')
    if(!result.data.error){
      setPendingPayments(result.data.finalArray)
    }
  }
useEffect(()=>{
getOrdersInfo()
getPendingPayments()
},[])
const handlePaid=async(orderId)=>{
const result=await axios.post('/markaspaid',{orderId})
if(!result.data.error){
  let newArray=pendingPayments.filter((order)=>order.orderId!==orderId)
  setPendingPayments(newArray)
}
}
  return (
      <>
      <AdminNavbar/>
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Active</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.active.priceTotal}</span>
          <span className="featuredMoneyRate">
        {orderInfo.active.count} 
          </span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cancelled</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.cancell.priceTotal}</span>
          <span className="featuredMoneyRate">
            {orderInfo.cancell.count}
          </span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Completed</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.complete.priceTotal}</span>
          <span className="featuredMoneyRate">
            {orderInfo.complete.count}
          </span>
        </div>
      </div>
    </div>
    <div className='featured'>
    <h1>Pending Payments (Payable):</h1>
    </div>
    <div className='featured2'>
    
    {pendingPayments.length<1?'No Pending Payments':pendingPayments.map((detail)=>(
      <div className='featuredItem'>
      <div>
        <h2>{detail.name}</h2>
        <h2>{detail.role}</h2>
        <h2>{detail.status}</h2>
        <h2>{detail.payable}{detail.status==='complete'?' (-15%)':' (-5%)'}</h2>
        <button className='btn' onClick={onOpen} >Account Details</button>
        
        <button className='btn' onClick={()=>handlePaid(detail.orderId)}>Mark as Paid</button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bank Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>Bank Name:</h1>
            <h3>{detail.bankDetail.bankname}</h3>
            <h1>Account No::</h1>
            <h3>{detail.bankDetail.accountNo}</h3>
            <h1>Routing No:</h1>
            <h3>{detail.bankDetail.routingNo}</h3>
            <h1>Phone No:</h1>
            <h3>{detail.bankDetail.phoneNo}</h3>
            <h1>Extra Details:</h1>
            <h3>{detail.bankDetail.extraDetails}</h3>

          </ModalBody>

         
        </ModalContent>
      </Modal>
    </div>
    
    ))}
    
    </div>
    
    </>
  );
}

export default Orders;