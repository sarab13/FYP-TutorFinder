import React from 'react'
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { ChatContext } from "../Context/ChatProvider";
import { useLocation } from 'react-router-dom';
import StudentNavbar from '../components/Student/StudentNavbar'
import TeacherNavbar from '../components/Teacher/TeacherNavBar'
import { useSelector ,useDispatch} from "react-redux";

const Chatpage = () => {
  const currentUser=useSelector((state)=>state.currentUser)
  let location=useLocation()
  const {user,setUser}=React.useContext(ChatContext)
  const [fetchAgain, setFetchAgain] = useState(false);
  
  
  
  return (
    <div style={{ width: "100%" }}>
    {currentUser.user.role==="STUDENT"?<StudentNavbar/>:<TeacherNavbar/>}
    
      {user&&<SideDrawer tutorId={location.state==null?undefined:location.state} />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        </Box>
        
    </div>
  );
};

export default Chatpage;