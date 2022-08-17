import React,{useState,useEffect} from 'react'
import styled from "styled-components"
import axios from 'axios'
import {Link} from 'react-router-dom'
import StudentNavbar from '../components/Student/StudentNavbar'

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
const Button=styled.button`
border: 2px solid ;
padding: 10px 15px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
`
const Text=styled.h1`
font-size: 20px;
margin-top: 20px;
margin-right: 10px;



`
const BottomContainer=styled.div`

margin:auto;
width: 70%;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

`
const Container=styled.div`
height: 200px;
width: 200px;
background-color: aliceblue;

`
const Tags=styled.div`

background-color: lightgrey;
border-radius: 10px;
padding: 10px;
text-align: center;
margin-top: 5px;
display: inline-block;
margin-right: 10px;
`




const SearchTutors = () => {
    const [searchValue,setsearchValue]=useState('')
    const [tutors,setTutors]=useState([])
   const handleSearch=(e)=>{
    setsearchValue(e.target.value)
    }
    const handleSubmit=async()=>{
        if(searchValue.length<1){
            return
        }
        const result= await axios.get(`/findtutors?subjectName=${searchValue}`)
        console.log(result.data.tutorsList)
        setTutors(result.data.tutorsList)

    }
    return (
        <div>
        <StudentNavbar/>
        <BottomContainer>
         <Text>Find Tutors  {tutors && tutors.length}</Text>
        <SearchContainer>
        <Input type="search" value={searchValue} placeholder="Subject/Skill" onChange={handleSearch}/>
        <Button onClick={handleSubmit}>Search</Button>

        </SearchContainer>
        
        {tutors.map((tutor)=>(
            <Link className='tutor-box' to='/tutorprofile' state={tutor}>
            <div >
           <div className='row1'>
                 <div className="left">
                     <img className="Image" src={tutor.profile_pic} alt='img'></img>
                     <h4 className="tutorName">{tutor.name}</h4>
                 </div>
                 <div>
                     <h4>{tutor.fee}$/hour</h4>
                 </div>
           </div>
           <div className='row2'>
                {tutor.subjects.map((subject)=>(
                    <Tags>{subject.name}</Tags>
                ))}
           </div>
        </div>
        </Link>

        ))}
        
       
        </BottomContainer>
        </div>
    )
}

export default SearchTutors
