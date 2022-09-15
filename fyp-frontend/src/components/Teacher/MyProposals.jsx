import React,{useState,useEffect} from 'react';
import TeacherNavBar from '../Teacher/TeacherNavBar'
import { useSelector } from 'react-redux';

import styled from "styled-components"
import { Link} from 'react-router-dom';
import axios from 'axios'

const BottomContainer=styled.div`

margin-top: 50px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;



`
const ViewPostContainer=styled(Link)`

width: 40%;


padding: 20px;
  margin-left: 20px;
  background-color: #f0c0c5;
  margin-bottom: 20px;
  border-radius: 20px;
  text-decoration: none;
  &::hover{
    text-decoration:none;
}
`
const Text=styled.h1`
font-size: 20px;
text-decoration: none;
&::hover{
    text-decoration:none;
}
margin-bottom: 10px;
/*margin-top: 20px;
margin-right: 10px;*/


`
const Span=styled.span`
font-weight:bold;
`
const MyProposals = () => {
    const [proposalsList,setProposalsList]=useState([])
    const currentUser=useSelector((state)=>state.currentUser)
    const getProposals=async()=>{
        const result=await axios.get(`/myproposals?tutorId=${currentUser.user._id}`)
        console.log(result)
        setProposalsList(result.data.data)
    }
    useEffect(() => {
      getProposals()
    }, [])
    return (
        <div>
        <TeacherNavBar/>
        <BottomContainer>
        <h1>{!proposalsList.length>0?'You have not submitted any Proposal Yet.':'My Proposals'}</h1>
            {proposalsList.length>0 && proposalsList.map((proposal)=>(
                <ViewPostContainer to={`/findjobs/${proposal.jobId}`}>
            <Text><Span> Job Title:</Span> {proposal.jobTitle}</Text>
            <Text> <Span>StudentName:</Span>{proposal.studentName} </Text>
            <Text>  <Span>Message:</Span> {proposal.message} </Text>
            <Text>  <Span>Price: </Span> {proposal.price}  </Text>


            </ViewPostContainer>
            ))}
            
        </BottomContainer>
        
            
        </div>
    )
}

export default MyProposals
