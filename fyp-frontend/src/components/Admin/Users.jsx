import './widgetLg.css'
import React,{useEffect,useState} from 'react'
import Sidebar from '../Admin/sidebar/Sidebar'
import AdminNavbar from '../Admin/AdminNavbar'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import styled from "styled-components"



const Button1=styled.button`
border: 2px solid ;
padding: 10px 15px;
margin-left: 20px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-top: 10px;
`
function WidgetLg() {
const [users,setUsers]=useState([])
const location=useLocation()
const getUsers=async(role)=>{
    const result=await axios.get(`/users?role=${role}`)
    if(!result.data.error){
         setUsers(result.data.Users)
    }
}
const handleToggleStatus=async(id)=>{
 const result=await axios.post('/toggleaccountstatus',{userId:id})
 if(!result.data.error){
    const newState=users.map((user)=>{
        if(user._id===id){
            return {...user,accountStatus:!user.accountStatus}
        }
        return user
 })
 setUsers(newState)

 }
}

const handledelete=async(id)=>{
    
    const result=await axios.post('/deleteaccountstatus',{userId:id})
    if(!result.data.error){
        const Users=users.filter((user)=>user._id!==id)
        setUsers(Users)
    }



    
}
useEffect(()=>{
    if(location.state==='STUDENT'){ 
         getUsers('STUDENT')
    }
    else{
         getUsers('TEACHER')
    }

},[location.state])
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  axios.get()
  return (
      <>
      <AdminNavbar/>
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Users</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Users</th>
          <th className="widgetLgTh">Joining Date</th>
          <th className="widgetLgThStatus">Status</th>
          <th className="widgetLgTh">Delete</th>
        </tr>
        {users.map((user)=>(
            <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src={user.imgUrl}
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">{user.name}</span>
          </td>
          <td className="widgetLgDate">14 May 2022</td>
          <td className="widgetLgAmount"><Button1 onClick={()=>handleToggleStatus(user._id)}> {user.accountStatus?'Block':'UnBlock' } </Button1> </td>
          <td className="widgetLgStatus">
          <Button1 onClick={()=>handledelete(user._id)}>Delete</Button1>
          </td>
        </tr>
      
        ))}
        
        </table>
    </div>
    </>
  );
}
export default WidgetLg;