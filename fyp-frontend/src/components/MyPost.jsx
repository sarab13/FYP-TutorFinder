import React,{useState} from 'react'
import axios from 'axios'
import styled from "styled-components"

import { useParams,Link } from 'react-router-dom'
import { useEffect } from 'react'
import SideDrawer from './miscellaneous/SideDrawer'
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
cursor:pointer;`

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
                <MenuItem><Link to='/findjobs'>Find jobs</Link></MenuItem>
                <MenuItem><Link to='/myprofile'>View Profile</Link></MenuItem>   
                

            </Menu>
            
            </Left>
            
            
            
            </Wrapper>
        </Container>
    <div className='bodyContainer'>
        <div className='left'>
            <h2>{post.title}</h2>
            <h5>{post.description}</h5>
            <h5>{post.budget}</h5>

        </div>
        {proposalslist==undefined?'': <div className='right'>
            <h2>List of Proposals - {proposalslist.length} </h2>
            ---------------------------------------------------
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
            </div>
           )}
           
        </div>}
    </div>
    

    </div>
  )
}
