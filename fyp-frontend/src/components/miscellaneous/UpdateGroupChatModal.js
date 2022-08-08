import React, { useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import  io  from 'socket.io-client';
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket;
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
 const currentUser=useSelector((state)=>state.currentUser)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers,setSelectedUsers]=useState([])
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers,setAllUsers]=useState([])
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } =React.useContext(ChatContext)
console.log(selectedChat)
const getSubscribers=async()=>{
  const result=await axios.get(`/getsubscribers?tutor_id=${currentUser.user._id}`)
  setAllUsers(result.data.data)
  //return allUsers
  console.log(selectedChat)
 // setSelectedChat({...selectedChat,users:allUsers})
 setLoading(false)
 } 

useEffect(()=>{
  getSubscribers()
},[])

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([])
      return;
    }

    try {
      setLoading(true);
      const searchResults=allUsers.filter((user)=>(user.username.includes(query)))
      const filterByReference = (arr1, arr2) => {
        let res = [];
        res = arr1.filter(el => {
           return !arr2.find(element => {
              return element.subscriber_id === el.subscriber_id;
           });
        });
        return res;
     }
      setLoading(false);
      setSearchResult(filterByReference(searchResults, selectedChat.users));
    } catch (error) {
      toast({

        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        }
      );

     
      //getSubscribers(name)

      for(let i=0;i<selectedChat.users.length;i++){
        let endpoint = 'https://api.ravenhub.io/company/6Z6EkKF28O/subscribers/'+selectedChat.users[i].subscriber_id+'/events/Mplvh97QLJ';
  
  await axios.post(endpoint, { "tutor" : currentUser.user.username,"newName":groupChatName,"oldName":selectedChat.chatName }, {
  headers: {'Content-type': 'application/json'}
  });
      setSelectedChat({...selectedChat,chatName:data.chatName});
    
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

     
       }



    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    console.log(user1)
    console.log(selectedChat.users)
    const exist=selectedChat.users.filter((user)=>user.subscriber_id===user1.subscriber_id)
    if (exist.length>0) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1.subscriber_id,
        }
      );

      setSelectedChat({...selectedChat,users:[user1,...selectedChat.users]});
      //getSubscribers()

      setFetchAgain(!fetchAgain);
      setLoading(false);
      let endpoint = 'https://api.ravenhub.io/company/6Z6EkKF28O/subscribers/'+user1.subscriber_id+'/events/8shZHG6nYU';

await axios.post(endpoint, { "tutor" : currentUser.user.username,"groupName":selectedChat.chatName }, {
headers: {'Content-type': 'application/json'}})
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1.subscriber_id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1.subscriber_id,
        }
      );
      
      //if(user1.subscriber_id === user._id) setSelectedChat()
      //else {
        const deleted=selectedChat.users.filter((userr)=>userr.subscriber_id!==user1.subscriber_id)
        setSelectedChat({...selectedChat,users:deleted})
       // getSubscribers()
      //}
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      let endpoint = 'https://api.ravenhub.io/company/6Z6EkKF28O/subscribers/'+user1.subscriber_id+'/events/cisu9syuiD';

      await axios.post(endpoint, { "tutor" : currentUser.user.username,"groupName":selectedChat.chatName }, {
      headers: {'Content-type': 'application/json'}})


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} size='full' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u.subscriber_id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;