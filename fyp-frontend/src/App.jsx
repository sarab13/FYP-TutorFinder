
import React,{useState} from 'react'
import './App.css'
import Register from "./pages/Register";
import AcademyPaymentForm from './pages/AcademyPaymentForm';
import Login from "./pages/Login.jsx";
import MyOrderPage from './pages/MyOrderPage'
import {Routes,Route,Navigate} from 'react-router-dom'
import CreatePost from "./components/CreatePost";
import Post from './components/Post'
import { StudentPosts } from './components/StudentPosts';
import Role from './pages/Role';
import TeacherProfileForm from './components/TeacherProfileForm';
import TeacherProfilePage from './components/TeacherProfilePage';
import TeacherView from './components/TeacherView';
import SinglePost from './components/SinglePost';
import MyPost from './components/MyPost';
import Chatpage from './pages/Chatpage';
import { ChatContext } from './Context/ChatProvider';
import { useSelector } from 'react-redux';
import OrderCreationForm from './pages/OrderCreationForm';
import MyOrders from './pages/MyOrders';
import LoginPage from './pages/LoginPage'
import SearchTutors from './components/SearchTutors';
import DirectOrder from './pages/DirectOrder.jsx'
import DetailedTeacherView from './components/DetailedTeacherView'
const App = () => {
  const currentUser=useSelector((state)=>state.currentUser)
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(currentUser.user);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  return <ChatContext.Provider value={{
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  }}>
  <Routes>
  <Route exact path='/' element={<Role/>}></Route>
  <Route exact path='/register' element={<Register/>}></Route>
  <Route exact path='/login' element={<LoginPage/>}></Route>
  <Route exact path='/createjob' element={<Post/>}></Route>
  <Route exact path='/myposts' element={<StudentPosts/>}></Route>
  <Route exact path='/updateprofile' element={<TeacherProfileForm/>}></Route>
  <Route exact path='/myprofile' element={<TeacherProfilePage/>}/>
  <Route exact path='/findjobs' element={<TeacherView/>}/>
  <Route exact path='/findjobs/:id' element={<SinglePost/>}/>
  <Route exact path='/myposts/:id' element={<MyPost/>}/>
  <Route exact path='/chat' element={<Chatpage/>}/>
  <Route exact path='/createorder' element={<OrderCreationForm/>}/>
  <Route exact path='/manageorders' element={<MyOrders/>}/>
  <Route exact path='/test' element={<MyOrderPage/>}/>
  <Route exact path='/searchtutors' element={<SearchTutors/>} />
  <Route exact path='/tutorprofile' element={<TeacherProfilePage/>}/>
  <Route exact path='/directorder' element={<DirectOrder/>}/>
  <Route exact path='subscribe' element={<AcademyPaymentForm/>}/>
  <Route exact path='/test2' element={<DetailedTeacherView/>}/>

  
</Routes>
</ChatContext.Provider>

};

export default App;