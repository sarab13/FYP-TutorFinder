import styled from "styled-components"
import { Facebook, Instagram, Twitter, Pinterest, Room, Phone, MailOutline } from "@material-ui/icons"


const Container=styled.div`
display: flex;
background-color: lightgray;
margin-top: 20px;


`
const Left=styled.div`
flex: 1;
display: flex;
flex-direction: column;
padding: 20px;

`
const Logo=styled.h1``
const Desc=styled.p`
margin: 20px 0px;
`
const SocialContainer=styled.div`
display: flex;
`
const SocialIcon=styled.div`
width: 40px;
height: 40px;
border-radius:50%;
color: white;
background-color: #${props=>props.color};
display: flex;
align-items: center;
justify-content: center;
margin-right: 20px;

`



const Center=styled.div`
flex: 1;
padding: 20px;


`
const Title=styled.h3`
margin-bottom: 30px;

`
const List=styled.ul`
margin:0;
padding: 0;
list-style: none;
display: flex;
flex-wrap: wrap;

`
const ListItem=styled.li`
width: 50%;
margin-bottom: 10px;

`

const Right=styled.div`
flex: 1;
padding: 20px;
`
const ContactItem=styled.div`
margin-bottom: 20px;
display: flex;
align-items: center;
`
const Payment=styled.img`
width: 50%;

`



const Footer = () => {
    return (
        <Container>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Desc>There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don’t look even slightly believable.</Desc>
          <SocialContainer>
              <SocialIcon color="3B5999">
                  <Facebook/>
              </SocialIcon>
              <SocialIcon color="E4405F">
                  <Instagram/>
              </SocialIcon>
              <SocialIcon color="55ACEE">
                  <Twitter/>
              </SocialIcon>
              <SocialIcon color="E60023">
                  <Pinterest/>
              </SocialIcon>
           
          </SocialContainer>

            </Left>
            <Center>

                <Title>Useful Links</Title>
                <List>
                <ListItem>About Us</ListItem>
          <ListItem></ListItem>
          <ListItem>Blog</ListItem>
          <ListItem>How it works (Students)</ListItem>
          <ListItem>How it works (Teachers)</ListItem>
          <ListItem>My Account</ListItem>
          
          <ListItem>Terms</ListItem>
                </List>
            </Center>
            <Right>

                <Title>Contact</Title>
                <ContactItem><Room style={{marginLeft:"10px"}}/>622,Silakot Pakistan</ContactItem>
                <ContactItem><Phone  style={{marginLeft:"10px"}}/>092 344758493</ContactItem>
                <ContactItem><MailOutline  style={{marginLeft:"10px"}}/>alis@gmail.com</ContactItem>
                <Payment src="https://i.ibb.co/Qfvn4z6/payment.png"/>


            </Right>
        </Container>
    )
}

export default Footer
