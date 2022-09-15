import React,{useEffect} from 'react'
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
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatContext } from "../../Context/ChatProvider";
  import UserBadgeItem from "../userAvatar/UserBadgeItem";
  import UserListItem from "../userAvatar/UserListItem";
  import {useSelector} from 'react-redux'
  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [allUsers,setAllUsers]=useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const currentUser=useSelector((state)=>state.currentUser)
    const {  user,chats, setChats,selectedChat } = React.useContext(ChatContext);
    const getSubscribers=async()=>{
     const result=await axios.get(`/getsubscribers?tutor_id=${currentUser.user._id}`)
     ///console.log(data)
    // setSearchResult(result.data.data)
     setAllUsers(result.data.data)
     console.log(result.data.data)
    setLoading(false)
    } 
    useEffect(()=>{
      setLoading(true)
      getSubscribers()
     },[])
    const handleGroup = (userToAdd) => {
      const exist=selectedUsers.filter((user)=>user.subscriber_id==userToAdd.subscriber_id)
      if (exist.length>0) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
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
        setSearchResult(filterByReference(searchResults, selectedUsers));
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
  
    const handleDelete = async(delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel.subscriber_id !== delUser.subscriber_id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        
        const { data } = await axios.post(
          `/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u.subscriber_id)),
            admin:currentUser.user._id
          }
        );
        console.log(data)
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
     for(let i=0;i<selectedUsers.length;i++){
      let endpoint = 'https://api.ravenhub.io/company/6Z6EkKF28O/subscribers/'+selectedUsers[i].subscriber_id+'/events/8shZHG6nYU';

await axios.post(endpoint, { "tutor" : currentUser.user.username,"groupName":groupChatName }, {
headers: {'Content-type': 'application/json'}
});
     }

        
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal size={'full'} onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u.subscriber_id}
                    admin={currentUser.user._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.map((user) => (
                    <UserListItem
                      key={user.subscriber_id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;