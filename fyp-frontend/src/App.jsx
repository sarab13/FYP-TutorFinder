import React from 'react'

import Register from "./pages/Register";
import Login from "./pages/Login.jsx";
import {Routes,Route,Navigate} from 'react-router-dom'
import CreatePost from "./components/CreatePost";
import Post from './components/Post'
import { StudentPosts } from './components/StudentPosts';
import Role from './pages/Role';
import TeacherProfileForm from './components/TeacherProfileForm';
import TeacherProfilePage from './components/TeacherProfilePage';
import TeacherView from './components/TeacherView';
const App = () => {
  
  return <Routes>
  <Route exact path='/' element={<Role/>}></Route>
  <Route exact path='/register' element={<Register/>}></Route>
  <Route exact path='/login' element={<Login/>}></Route>
  <Route exact path='/createjob' element={<Post/>}></Route>
  <Route exact path='/myposts' element={<StudentPosts/>}></Route>
  <Route exact path='/updateprofile' element={<TeacherProfileForm/>}></Route>
  <Route exact path='/myprofile' element={<TeacherProfilePage/>}/>
  <Route exact path='/findjobs' element={<TeacherView/>}/>
</Routes>


};

export default App;