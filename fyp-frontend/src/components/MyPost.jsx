import React,{useState} from 'react'
import axios from 'axios'
import styled from "styled-components"
import moment from 'moment'


import { useParams,Link } from 'react-router-dom'
import { useEffect } from 'react'
import SideDrawer from './miscellaneous/SideDrawer'
//import { Button } from '@material-ui/core'


import { FcGraduationCap, FcViewDetails ,FcBusinessman} from "react-icons/fc";
import { GoLocation, GoCalendar } from "react-icons/go";
import{BsCurrencyDollar ,BsGenderAmbiguous} from "react-icons/bs"
import{MdPostAdd} from "react-icons/md"
import{GiLevelThree} from "react-icons/gi"
import{CgProfile} from "react-icons/cg"
import StudentNavbar from './Student/StudentNavbar'





/*const Container=styled.div`
height: 80px;
background-color: lightgrey;

`*/
/*const Wrapper=styled.div`
padding: 20px 20px;
display: flex;
justify-content: space-between;
align-items: center;
`*/
const Left=styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
`
const Logo1=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
`
const Menu1=styled.ul`
display: flex;
align-items: center;
justify-content: space-between;
list-style: none;
`
const MenuItem1=styled.li`
margin-right: 30px;
font-size: 20px;
font-weight: bold;

`
const Button=styled.button`
border: 2px solid ;

margin-left: 10px;
margin-top: 10px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
width: 100px;
height: 50px;
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
const Text1=styled.h1`
font-size: 15px;
margin-top: 10px;
margin-right: 10px;
font-weight:bold;


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

width: 100%;
margin-top: 10px;




padding: 20px;
  margin-left: 20px;
  

`
const Tags=styled.div`

height: 30px;
background-color: lightgrey;

padding-left: 10px;
padding-right: 10px;
text-align: center;
margin-top: 5px;
margin-left: 10px;
border-radius:10px;

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


//
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
/*const Left=styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
`*/
const Text=styled.h1`
font-size: 16px;

margin-bottom: 10px;
/*margin-top: 20px;
margin-right: 10px;*/


`
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;
font-size: 20px;
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
cursor:pointer;`
const Leftcontainer=styled.div`

margin-top: 10px;
width: 50%;

background-color: #f0c0c5;
margin-left: 20px;
border-radius: 20px;
margin-right: 100px;

padding: 20px;

`

export default function MyPost() {
    const {id}=useParams()
    const [proposalslist,setProposalsList]=useState(undefined)
    const [post,setPost]=useState({
        title:'',
        subjects:[],
        description:'',
        deadline:'',
        budget:0
    })

    const getJob=async()=>{
        const body={id}
        const result=await axios.post('/getjob',body)
  
        setPost({...post,
        _id:id,
        title:result.data.job.title,
        subjects:result.data.job.subjects,
        description:result.data.job.description,
        deadline:result.data.job.deadline,
        budget:result.data.job.budget,
        createdAt:result.data.job.createdAt
        })
        }
    useEffect(()=>{
        getJob()
    },[])


    const getProposalsList=async()=>{
        const body={jobId:id}
        const response=await axios.post('/proposalslist',body)
        console.log(response)
        if(response.data.message=='success'){
            setProposalsList(response.data.bidsList)
        }
    
    }
    useEffect(()=>{
       getProposalsList()
    },[])


   
  return (
    <div>
    <StudentNavbar/>
    <div className='bodyContainer'>
    <Leftcontainer>
   {/* <div className='left'>

<Text>{post.title}</Text>
<Text>{post.description}</Text>
<Text>Budget:  {post.budget}</Text>

</div>
   */}

   <BottomContainer>
        <Text1>{post.title}</Text1>
        <ViewPostContainer>
        
        <Row>
        {post.subjects.map((subject)=>(
          <Tags>{subject.name}</Tags>
        ))}
        

        </Row>
        <Row>
      
        <BsCurrencyDollar/> <Text>  <span className="text">Amount:</span> {post.budget}</Text>




        </Row>
        <Row>
        <MdPostAdd/> <Text>  <span className="text">Posted:</span>{moment(post.createdAt).fromNow()}</Text>
        




        </Row>
       
        <Text>
        {post.description}


        </Text>

        



        </ViewPostContainer>
       
        </BottomContainer>
    </Leftcontainer>

       
        {proposalslist==undefined?'': <div className='right'>
            <Text>List of Proposals - {proposalslist.length} </Text>
            ---------------------------------------------------------------------------------------
           {proposalslist.map((proposal)=><div className='box'>
            <div className='header'>
                  <h3><span className="text"> Name:</span>{proposal.name}</h3>
                  <h5><span className="text">bidding Price:</span>{proposal.price}$</h5>
            </div>
            <div className='footer'>
                  <p>{proposal.message}</p>
            </div>
            <Row>
           <Button><Link to='/chat' state={proposal.tutorId}>Message Now</Link></Button> 
            <Button><Link to='/createorder' state={[post,proposal]}>Order Now</Link> </Button>
            </Row>
            </div>
           )}
           
        </div>}
    </div>
    

    </div>
  )
}
