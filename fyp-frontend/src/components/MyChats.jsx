import React from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatContext } from "../Context/ChatProvider";
import { useSelector } from 'react-redux';
import  io  from 'socket.io-client';
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket;
const MyChats = ({ fetchAgain }) => {
const currentUser=useSelector((state)=>state.currentUser)
 const { selectedChat, setSelectedChat,  chats, setChats } = React.useContext(ChatContext);
 

 /*const setSelectedChat=ChatState.setSelectedChat;
 const notification=ChatState.notification;
 const user=ChatState.user;
 const setUser=ChatState.setUser;
 const setNotification=ChatState.setNotification;
 const chats=ChatState.chats;
 const setChats=ChatState.setChats;
 const selectedChat=ChatState.selectedChat*/
  const toast = useToast();
  const handleUpdate=()=>{
    console.log("updayed")
  }
 
  
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const {data}= await axios.post("/api/chat/allchats",{userId:currentUser.user._id}); 
      setChats([...data]);
      console.log(data)

    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
   // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  const getSubscribers=async(chat)=>{
    if(chat.isGroupChat){
    const result=await axios.get(`/getsubscribers?tutor_id=${currentUser.user._id}`)
        //setSelectedChat(chat)
        console.log(chat)
        let members=[]
        for(let i=0;i<result.data.data.length;i++){
          for(let j=0;j<chat.users.length-1;j++){
            if(result.data.data[i].subscriber_id==chat.users[j]._id){
              members.push(result.data.data[i])
              break;
            }
          }
        }
          setSelectedChat({...chat,users:members})

    }
    else{
      setSelectedChat(chat)
    }
    
    //setSelectedChat({...selectedChat,users:allUsers})
   //setLoading(false)
   } 
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={currentUser.user.role=="TEACHER"?"flex":"none"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            
          >
            Create Academy
          </Button>
        </GroupChatModal>
      </Box>
     <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => getSubscribers(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                
                <Text>{!chat.isGroupChat? getSender(currentUser.user, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.username} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>

            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
        </Box> 
    </Box>
  );
};

export default MyChats;