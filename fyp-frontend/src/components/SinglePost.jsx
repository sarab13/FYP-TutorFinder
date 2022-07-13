import React from 'react'
import { useParams } from 'react-router-dom'
import styled from "styled-components"
import { Link , useLocation} from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'


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
cursor:pointer;

`

export default function SinglePost() {
const {id}=useParams()
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
  return (
    <div>

<Container>
            <Wrapper>
            <Left>
            <Logo>Tutor Finder</Logo>
            <Menu>
                <MenuItem>Dashboard</MenuItem>
                <Link to='/findjobs'>Find jobs</Link>
                <Link to='/myprofile'>View Profile</Link>   
                

            </Menu>
            
            </Left>
            
            
            
            </Wrapper>
        </Container>

        <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
        </div>
    </div>
  )
}
