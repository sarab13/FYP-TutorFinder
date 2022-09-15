import React,{useState,useEffect} from 'react'; 
import '../App.css'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { fontsize } from 'react-notification-center-component';
import StarRatings from 'react-star-ratings';
import styled from "styled-components"
import TeacherNavbar from "../components/Teacher/TeacherNavBar"
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
  const [orderRating,setOrderRating]=useState()
  const [orderMessage,setOrderMessage]=useState()
     const [tutorIds,setTutorId]=useState()
     const [orderIds,setOrderId]=useState()
    const [rating,changeRating]=useState()
    const [review,setReview]=useState('')
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
    const { isOpen:isOpenReview, onOpen:onOpenReview, onClose:onCloseReview } = useDisclosure()

    const finalRef = React.useRef(null)
    
    const getOrders=async()=>{
        const result=await axios.get(`/tmyorders?userId=${currentUser.user._id}`)
        const result2=await axios.get(`/tmydirectorders?userId=${currentUser.user._id}`)
        console.log(result)
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
    const handleIds=(orderId,tutorId)=>{
      setTutorId(tutorId)
      setOrderId(orderId)
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
    const handleReviewMsg=(e)=>{
        setReview(e.target.value)
    }
    const handleReview=async(orderId,tutorId)=>{
       // e.preventDefault()
       alert(orderIds+" "+tutorIds)
        const result=await axios.post('/review',{orderId:orderIds,studentId:currentUser.user._id,tutorId:tutorIds,stars:rating,message:review})
       console.log(result)
        if(!result.data.error){
            alert("success")
            onClose();
            const newArray=completedOrders;
          /*  for(let i=0;i<newArray.length;i++){
                if(newArray[i].order_id==orderId){
                    newArray[i].review.stars=rating;
                    newArray[i].review.message=review;
                    break;
                }
            }
            setCompletedOrders(newArray)*/
        }
    }
    const handleRatingAndReview=(starss,messagee)=>{
    setOrderRating(starss)
    setOrderMessage(messagee)
    }
    return <>
    <TeacherNavbar/>
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
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div><div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        
       
       </div>
    ))}
    {activeDirectOrders.length>0 && activeDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">Direct Order</h1>
        </div>
        <div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        
        
        
       </div> 
    ))}
    </TabPanel>
    <TabPanel width={'100%'}>
    
    {completedOrders.length>0 && completedOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div>
        
        

<div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        {order.review?
        <Button onClick={()=>{onOpen();handleRatingAndReview(order.review.stars,order.review.message)}}>Reviewed: {order.review.stars} Stars</Button>:
        ''
                }
        

        <Modal w={100} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Your review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              
            <StarRatings
            rating={orderRating}
            starRatedColor="orange"
            //changeRating={changeRating}
            numberOfStars={5}
            name='rating'
            disabled
          />
            <h4 className='submittedReview'>{orderMessage}</h4>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal finalFocusRef={finalRef} isOpen={isOpenReview} onClose={onCloseReview}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          <StarRatings
          rating={rating}
          starRatedColor="orange"
          changeRating={changeRating}
          numberOfStars={5}
          name='rating'
        />
          <h4 className='reviewlabel'>Write something about tutor...</h4>
          <textarea value={review} onChange={handleReviewMsg} className='reviewbox' rows={3}  ></textarea>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseReview}>
              Close
            </Button>
            <Button variant='ghost' onClick={()=>handleReview(order._id,order.tutorId)}>Post Review</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

       </div> 
    ))}
    
    {completedDirectOrders.length>0 && completedDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">Direct Order</h1>
        </div>
        <div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        {order.review?
        <Button onClick={()=>{onOpen();handleRatingAndReview(order.review.stars,order.review.message)}}>Reviewed: {order.review.stars} Stars</Button>:
        <Button onClick={()=>{onOpenReview();handleIds(order._id,order.tutorId)}}>leave a review</Button>
                }
       
       <Modal w={100} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Your review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              
            <StarRatings
            rating={orderRating}
            starRatedColor="orange"
            //changeRating={changeRating}
            numberOfStars={5}
            name='rating'
            disabled
          />
            <h4 className='submittedReview'>{orderMessage}</h4>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal finalFocusRef={finalRef} isOpen={isOpenReview} onClose={onCloseReview}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          <StarRatings
          rating={rating}
          starRatedColor="orange"
          changeRating={changeRating}
          numberOfStars={5}
          name='rating'
        />
          <h4 className='reviewlabel'>Write something about tutor...</h4>
          <textarea value={review} onChange={handleReviewMsg} className='reviewbox' rows={3}  ></textarea>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseReview}>
              Close
            </Button>
            <Button variant='ghost' onClick={()=>handleReview(order._id,order.tutorId)}>Post Review</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

       </div> 
    ))}
   
    </TabPanel>
    <TabPanel >
    {cancelledOrders.length>0 && cancelledOrders.map((order)=>(

        <div>
        <div>
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div><div>
        <p className="tutorName">order status: <span>{order.orderStatus}</span></p>
        <p className="tutorName">{order.orderPrice}$</p>
        </div>
        
       
       </div>
    ))}
    {cancelledDirectOrders.length>0 && cancelledDirectOrders.map((order)=>(
        <div>
        <div>
         <p className="tutorName">Student: <span><Link to='/'>{order.studentName}</Link></span></p>
        <h1 className="tutorName">{order.jobTitle}</h1>
        </div><div>
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