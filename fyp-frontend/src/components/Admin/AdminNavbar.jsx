
import styled from "styled-components"
import { Link,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationCenter from 'react-notification-center-component';

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


const AdminNavbar = () => {
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
       <MenuItem><Link to='/dashboard'>Home</Link></MenuItem>

        <MenuButton
        mx={19}
        fontSize={22}
        fontWeight='bold'
            _expanded={{ bg: '#E2E8F0' }}

        _focus={{outline:'none'}} as={Button} bg="lightgray" rightIcon={<ChevronDownIcon />}>
              Users
            </MenuButton>  
            <MenuList p={6}>
              <MenuItem><Link to='/users' state='STUDENT'>Students</Link></MenuItem>
              <MenuDivider />
              <MenuItem><Link to='/users' state='TEACHER'>Tutors</Link></MenuItem>
            </MenuList>
            </Menu>




            <MenuItem><Link to='/admin' onClick={handleLogout}>Logout</Link></MenuItem>


                      
        </Menu1>
        
        </Left>
        
        
        
        </Wrapper>
    </Container>
    )
}

export default AdminNavbar
