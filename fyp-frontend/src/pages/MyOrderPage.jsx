import React,{useState,useEffect} from 'react'; 
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
export default function MyOrderPage(){
    const currentUser=useSelector((state)=>state.currentUser)
    const [activeOrders,setActiveOrders]=useState([])
    const [cancelledOrders,setCancelledOrders]=useState([])
    const [completedOrders,setCompletedOrders]=useState([])
    const [activeDirectOrders,setActiveDirectOrders]=useState([])
    const [cancelledDirectOrders,setCancelledDirectOrders]=useState([])
    const [completedDirectOrders,setCompletedDirectOrders]=useState([])
    const [isComplete,setIsComplete]=useState(false)

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
        setIsComplete(true)
       // handleUpdate(orderId,"complete")
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
<Tabs isFitted variant='enclosed'>
  <TabList mb='1em'>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Active</Tab>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Completed</Tab>
    <Tab _selected={{fontSize:20, fontWeight:'bold'}}>Cancelled</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <div class="modal-body">
          {isComplete?<form>
            <label>Your Price:</label><br/>
            <input type='number' ></input><br/>
            <label>Message:</label><br/>
            <textarea rows="8" cols="65" ></textarea>
            <input type='submit' value="Submit" ></input>
            
          </form>:''}
        </div>
    {activeOrders.length>0 && activeOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>{order.jobTitle}</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <div><button onClick={()=>handleUpdate(order._id,"cancelled")}>Cancel</button>
            <button onClick={()=>handleComplete(order._id)}>Mark as complete</button></div>
       </div> 
    ))}
    {activeDirectOrders.length>0 && activeDirectOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>Direct Order</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <div><button onClick={()=>handleUpdateDirect(order._id,"cancelled")}>Cancel</button>
            <button onClick={()=>handleComplete(order._id)}>Mark as complete</button></div>
       </div> 
    ))}
    </TabPanel>
    <TabPanel>
    {completedOrders.length>0 && completedOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>{order.jobTitle}</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <button disabled>{order.orderStatus}</button>

       </div> 
    ))}
    {completedDirectOrders.length>0 && completedDirectOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>Direct Order</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <button disabled>{order.orderStatus}</button>

       </div> 
    ))}
   
    </TabPanel>
    <TabPanel>
    {cancelledOrders.length>0 && cancelledOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>{order.jobTitle}</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <button disabled>{order.orderStatus}</button>

       </div> 
    ))}
    {cancelledDirectOrders.length>0 && cancelledDirectOrders.map((order)=>(
        <div><div>
         <p>Tutor: <span><Link to='/'>{order.tutorName}</Link></span></p>
        <h1>{order.jobTitle}</h1>
        <p>order status: <span>{order.orderStatus}</span></p>
        <p>{order.orderPrice}$</p>
        </div>
        
        <button disabled>{order.orderStatus}</button>

       </div> 
    ))}
    </TabPanel>
  </TabPanels>
</Tabs>
    </>
}