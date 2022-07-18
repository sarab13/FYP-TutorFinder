import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatpage from "../pages/Chatpage";
import SideDrawer from "../components/miscellaneous/SideDrawer";
export const ChatContext = createContext();

/*const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useNavigate();

  /*useEffect(() => {
   // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
   const userInfo={_id:"62d0a07fff5c6adb500d21f7"} 
   setUser(userInfo);

    if (!userInfo) history.navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
    value="Hi"
      /*value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
      <Chatpage/>
      <SideDrawer/>
    </ChatContext.Provider>
  );
};*/



//export default ChatProvider;