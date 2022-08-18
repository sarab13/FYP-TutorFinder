import React,{useState,useEffect} from 'react'; 
import '../App.css'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { fontsize } from 'react-notification-center-component';
import StarRatings from 'react-star-ratings';
import styled from "styled-components"
import StudentNavbar from "../components/Student/StudentNavbar"
import { useDisclosure } from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
const Button = styled.button`
  
  border: none;
  padding: 5px;
  background-color: crimson;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 20px;
  width: 40%;
  height: 50px;
  
`;
export default function MyOrderPage(){
    const [rating,changeRating]=useState()
    
    const currentUser=useSelector((state)=>state.currentUser)
    const [isSubmit,setIsSubmit]=useState(true)
    const [activeOrders,setActiveOrders]=useState([])
    const [cancelledOrders,setCancelledOrders]=useState([])
    const [completedOrders,setCompletedOrders]=useState([])
    const [activeDirectOrders,setActiveDirectOrders]=useState([])
    const [cancelledDirectOrders,setCancelledDirectOrders]=useState([])
    const [completedDirectOrders,setCompletedDirectOrders]=useState([])
    const [isComplete,setIsComplete]=useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef(null)
    
    const getOrders=async()=>{
        const result=await axios.get(`/myorders?userId=${currentUser.user._id}`)
        const result2=await axios.get(`/mydirectorders?userId=${currentUser.user._id}`)

        const active=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="active";
        })
        setActiveOrders(active)
        const cancel=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="cancelled";
        })
        setCancelledOrders(cancel)
        const complete=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="complete"
        })
        setCompletedOrders(complete)



        const activeDirect=result2.data.listOfOrders.filter(function (order){
            return order.orderStatus=="active";
        })
        setActiveDirectOrders(activeDirect)
        const cancelDirect=result2.data.listOfOrders.filter(function (order){
            return order.orderStatus=="cancelled";
        })
        setCancelledDirectOrders(cancelDirect)
        const completeDirect=result2.data.listOfOrders.filter(function (order){
            return order.orderStatus=="complete"
        })
        setCompletedDirectOrders(completeDirect)
        


    }
    useEffect(()=>{
        getOrders()
    },[])
    const handleComplete=(orderId)=>{
        //setIsComplete(true)
       handleUpdate(orderId,"complete")
    }
    const handleUpdate=async(order_id,status)=>{
        const res=await axios.put("/updateorderstatus",{order_id,status})
        const result=await axios.get(`/myorders?userId=${currentUser.user._id}`)
        const active=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="active";
        })
        setActiveOrders(active)
        const cancel=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="cancelled";
        })
        setCancelledOrders(cancel)
        const complete=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="complete"
        })
        setCompletedOrders(complete)
    }

    const handleUpdateDirect=async(order_id,status)=>{
        const res=await axios.put("/updatedirectorderstatus",{order_id,status})
        const result=await axios.get(`/mydirectorders?userId=${currentUser.user._id}`)
        const active=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="active";
        })
        setActiveDirectOrders(active)
        const cancel=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="cancelled";
        })
        setCancelledDirectOrders(cancel)
        const complete=result.data.listOfOrders.filter(function (order){
            return order.orderStatus=="complete"
        })
        setCompletedDirectOrders(complete)
    }
    return <>
    <StudentNavbar/>
<Tabs isFitted variant='enclosed'>
  <TabList mb='1em'>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Active</Tab>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Completed</Tab>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Cancelled</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
   
    {activeOrders.length>0 && activeOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div><div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        
        <Button onClick={()=>handleUpdate(order._id,"cancelled")}>Cancel</Button>
            <Button onClick={()=>handleUpdate(order._id,"complete")}>Mark as complete</Button></div>
       
    ))}
    {activeDirectOrders.length>0 && activeDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">Direct Order</h1>
        </div>
        <div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        
        
         <Button onClick={()=>handleUpdateDirect(order._id,"cancelled")}>Cancel</Button>
            <Button onClick={()=>handleUpdateDirect(order._id,"complete")}>Mark as complete</Button>
       </div> 
    ))}
    </TabPanel>
    <TabPanel width={'100%'}>
    
    {completedOrders.length>0 && completedOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div>
        
        

<div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        <Button onClick={()=>setIsSubmit(true)}>leave a review</Button>
       
        
 

       </div> 
    ))}
    
    {completedDirectOrders.length>0 && completedDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">Direct Order</h1>
        </div>
        <div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        <Button onClick={onOpen}>leave a review</Button>
       
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          <StarRatings
          rating={rating}
          starRatedColor="blue"
          changeRating={changeRating}
          numberOfStars={6}
          name='rating'
        />
          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
       </div> 
    ))}
   
    </TabPanel>
    <TabPanel >
    {cancelledOrders.length>0 && cancelledOrders.map((order)=>(

        <div className="OrderBox">

        <div>
<div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div>
        <div>
        <p className="tutorName"> order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        </div>
        
        <button disabled>{order.orderStatus}</button>

       </div> 
    ))}
    {cancelledDirectOrders.length>0 && cancelledDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1 className="tutorName">Direct Order</h1>
        </div>
        <div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        </div>
        
        

       
    ))}
    </TabPanel>
  </TabPanels>
</Tabs>
    </>
}