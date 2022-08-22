import React,{useState,useEffect} from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
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
  IconButton,
  Text,
  Image,
  useSlider,
} from "@chakra-ui/react";
import axios from 'axios'
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
 const currentUser=useSelector((state)=>state.currentUser)
 const [profile,setProfile]=useState({name:'',location:'',profile_pic:''})
 const getProfileInfo=async()=>{
    const result=await axios.post('/stdmyprofile',{studentId:currentUser.user._id})
    console.log(result)
   if(!result.data.error){
    setProfile({
        ...profile,
        name:result.data.myProfile.name,
        location:result.data.myProfile.location,
        profile_pic:result.data.myProfile.profile_pic
    })
   }

 }
 useEffect(()=>{
    getProfileInfo()
 },[])
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {profile.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={profile.profile_pic}
              alt={profile.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
             From: {profile.location}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;