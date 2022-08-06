import React from 'react'
import TeacherView from '../components/TeacherView'
import CreatePost from '../components/CreatePost'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
export default function Role() {
    const currentUser=useSelector((state)=>state.currentUser)
    if(!currentUser.isLoggedIn){
        return <Navigate to='/login'/>
    }
    if(currentUser.user.role=='STUDENT'){
        return <CreatePost/>
    }
    else{
        return <TeacherView/>
    }
  
}
