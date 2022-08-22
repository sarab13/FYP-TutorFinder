import styled from "styled-components"
import { Link,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationCenter from 'react-notification-center-component';
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from "../miscellaneous/ProfileModal";
import { logoutUser } from '../../redux/actions/action';
import {  useDispatch} from "react-redux";


import {
    MenuButton,MenuList, MenuDivider,

  } from "@chakra-ui/react";

  import {  ChevronDownIcon } from "@chakra-ui/icons";
  import { Button,Menu, } from "@chakra-ui/react";



const Container=styled.div`
height: 80px;
background-color: lightgrey;
position:sticky;
top:0;
z-index:10;

`
const Wrapper=styled.div`
padding: 20px 20px;
display: flex;
justify-content: space-between;
align-items: center;

`
const Left=styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
`
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
font-size: 20px;
`
const Menu1=styled.ul`
display: flex;
align-items: center;
justify-content: space-between;
list-style: none;
`
const MenuItem=styled.li`
margin-right: 30px;
font-size: 20px;
font-weight: bold;

`


const StudentNavbar = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const currentUser=useSelector((state)=>state.currentUser)
    const handleLogout=()=>{
        dispatch(logoutUser())
        navigate('/login')
    }
    return (
        <Container>
        <Wrapper>
        <Left>
        <Logo>Tutor Finder</Logo>
        <Menu1>




    
        

             
            <Menu>
            <MenuButton
        
            mx={13}
             _expanded={{ bg: 'lightgray' }}
             _hover={{ bg: 'lightgray' }}
            _focus={{outline:'none'}}
             as={Button} bg="lightgray" rightIcon={<ChevronDownIcon />}>
             
              <Avatar
                size="lg"
                cursor="pointer"
                backgroundColor="black"
                marginLeft="10px"
                
                
                //name={user.name}
                //src={user.pic}
              />
            
            </MenuButton>  
            <MenuList p={6}>

              

              <MenuItem><Link to='/login' onClick={handleLogout}>Logout</Link></MenuItem>
            </MenuList>
            </Menu>             
        </Menu1>
        
        </Left>
        
        
        
        </Wrapper>
    </Container>
    )
}

export default StudentNavbar
