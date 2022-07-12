
import styled from "styled-components"
import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import { GoLocation, GoCalendar } from "react-icons/go";
import{BsCurrencyDollar ,BsGenderAmbiguous} from "react-icons/bs"
import{MdPostAdd} from "react-icons/md"
import{GiLevelThree} from "react-icons/gi"
import{CgProfile} from "react-icons/cg"





const Container=styled.div`
height: 80px;
background-color: lightgrey;

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
`
const Menu=styled.ul`
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
const Button=styled.button`
border: 2px solid ;
padding: 10px 15px;
margin-left: 10px;
margin-top: 10px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
`
const BottomContainer=styled.div`

margin-top: 50px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

`

const PostButton=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-top: 20px;

`
const Text=styled.h1`
font-size: 15px;
margin-top: 10px;
margin-right: 10px;


`
const FindTeachersButton=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: green;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
margin-top: 20px;
`
const Input=styled.input`
flex: 1;
  min-width: 100%;

  padding: 10px;


`
const SearchContainer=styled.div`
display: flex;
margin-top: 10px;
margin-bottom: 20px;

`
const ViewPostContainer=styled.div`

width: 40%;
margin-top: 10px;




padding: 20px;
  margin-left: 20px;
  background-color: lightsalmon;

`
const Tags=styled.div`

height: 30px;
background-color: lightgrey;

padding-left: 10px;
padding-right: 10px;
text-align: center;
margin-top: 5px;
margin-left: 10px;

`
const Desc=styled.h5`

font-size: 15px;
margin-top: 10px;

`
const Row=styled.div`

display:flex;
margin-left: 10px;
margin-bottom: 10px;
`


const DetailedTeacherView = () => {
    return (
        <div>
         <Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>My jobs</MenuItem>
                <MenuItem>View profile</MenuItem>
                
                

            </Menu>
            
            </Left>
            
            
            
            </Wrapper>
        </Container>
        
        <BottomContainer>
        <h3>Online physice teacher required in lahore at urgent base</h3>
        <ViewPostContainer>
        
        <Row>
        <Tags>Physics</Tags>
        <Tags>Applied physics</Tags>

        </Row>
        <Row>
        <Text> <GoLocation/>location:  lahore</Text>
        <Text> <BsCurrencyDollar/> Amount: 10 dollar</Text>




        </Row>
        <Row>
        <Text> <MdPostAdd/> Posted: 10 mints ago</Text>
        <Text> <GiLevelThree/> level: Beginner</Text>




        </Row>
        <Row>
        <Text> <CgProfile/> Posted by:  Ali husnain</Text>
        <Text> <BsGenderAmbiguous/> Gender prefrence: male</Text>




        </Row>
        <Text>
        I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possibleI need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible        I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possibleI need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible I need an C++ tutor to help me in solving some questions.Please Contact me as soon as possible


        </Text>

        <Button>Bid Now</Button>
        <Button>Contact</Button>



        </ViewPostContainer>
       
        </BottomContainer>
        
  


            
        </div>
    )
}

export default DetailedTeacherView
