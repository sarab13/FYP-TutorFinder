import React,{useState} from 'react'
import axios from 'axios'
import styled from "styled-components"

import { useParams,Link } from 'react-router-dom'
import { useEffect } from 'react'
import SideDrawer from './miscellaneous/SideDrawer'
import { Button } from '@material-ui/core'
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

margin-top: 20px;
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
        budget:result.data.job.budget
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
     <Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem>Dashboard</MenuItem>
               <MenuItem><Link to='/findjobs'>Find jobs</Link> </MenuItem> 
               <MenuItem><Link to='/myprofile'>View Profile</Link>  </MenuItem>  
                

            </Menu>
            
            </Left>
            
            
            
            </Wrapper>
        </Container>
    <div className='bodyContainer'>
    <Leftcontainer>
    <div className='left'>

<Text>{post.title}</Text>
<Text>{post.description}</Text>
<Text>Budget:  {post.budget}</Text>

</div>

    </Leftcontainer>

       
        {proposalslist==undefined?'': <div className='right'>
            <Text>List of Proposals - {proposalslist.length} </Text>
            ---------------------------------------------------------------------------------------
           {proposalslist.map((proposal)=><div className='box'>
            <div className='header'>
                  <h3>{proposal.name}</h3>
                  <h5>{proposal.price}$</h5>
            </div>
            <div className='footer'>
                  <p>{proposal.message}</p>
            </div>
           <p>{proposal.tutorId}</p>
            <Link to='/chat' state={proposal.tutorId}>Message Now</Link>
            <Link to='/createorder' state={[post,proposal]}>Order Now</Link>
            </div>
           )}
           
        </div>}
    </div>
    

    </div>
  )
}
