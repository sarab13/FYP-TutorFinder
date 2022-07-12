
import React,{ useState } from "react";
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;

margin-top: 10px;
margin-left: 20px;
`
const Container = styled.div`
  width: 100vw;
  
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title=styled.h1`
font-size: 30;
font-weight: bold;
margin-top: 30px;
margin-bottom: 20px;

`
const Lable=styled.h5`

`
const Form=styled.form`


`
const Input=styled.input`
flex: 1;
  min-width: 40%;

  padding: 10px;


`
const TextArea=styled.textarea`
 width: 400px;
  height: 100px;
  padding: 20px;


`
const Button=styled.button`
border: 2px solid ;
padding: 10px 15px;
margin-left: 20px;
background-color: crimson;
color: white;
font-weight: bold;
border-radius: 10px;
cursor: pointer;
`

const Post = () => {
  const navigate=useNavigate()
  const currentUser=useSelector((state)=>state.currentUser)
  const [error,setError]=useState('')
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [budget,setBudget]=useState(0)
  const [deadline,setDeadline]=useState(null)
  const [subjects,setSubjects]=useState([])
  const [Options,setOptions]=useState([{name: 'Physics', id: 1},{name: 'Computer', id: 2}])
  const onSelect=(selectedList, selectedItem) =>{
    setSubjects([...selectedList])
}
  const onRemove=(selectedList, removedItem)=> {
    const newArray=subjects.filter((item)=>{
      return item.id!=removedItem.id
    })
    setSubjects([])
    setSubjects([...newArray])
}
const handleTitle=(e)=>{
  setTitle(e.target.value)
}
const handleDescription=(e)=>{
  setDescription(e.target.value)
}
const handleDeadline=(e)=>{
setDeadline(e.target.value)
}
const handleBudget=(e)=>{
  setBudget(e.target.value)
}
const handleSubmit=async(e)=>{
e.preventDefault()
alert(currentUser.user._id)
let body={
  title,
  description,
  budget,
  deadline,
  subjects,
  user_id:currentUser.user._id
}
const res=await axios.post('http://localhost:5000/createJob',body)
if(res.error){
  setError(res.message)
}
else{
   setError('')
   navigate('/myposts')
   
}
}
    return (
        <div>
        <Logo>Tutor Finder</Logo>
        <Container>

            

            <Form>
            <Title>Post Your requirements</Title>
                <Lable>Title:</Lable>
                <Input type="text" value={title} onChange={handleTitle}/>
                <Lable>Description</Lable>
                <TextArea value={description} onChange={handleDescription}/>
                <Lable>Budget In USD:</Lable>
                <Input type="number" value={budget} onChange={handleBudget}/>
                <Lable>Subjects</Lable>
                <Multiselect
                  options={Options} // Options to display in the dropdown
                  selectedValues={Options[0]} // Preselected value to persist in dropdown
                 onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  />
                <Lable>Deadline</Lable>
                <Input  onChange={handleDeadline} value={deadline} type="date"/>
                <p>{error}</p>
                <Button onClick={handleSubmit}>Submit</Button>
            </Form>
            
        </Container>
      
            
        </div>
    )
}
export default Post