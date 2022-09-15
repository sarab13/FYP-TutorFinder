
import React,{ useState ,useEffect} from "react";
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';
import { useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import styled from "styled-components"
import StudentNavbar from "../components/Student/StudentNavbar"
import {Options} from './list'
const Logo=styled.h1`
font-weight: bold;
text-decoration: underline crimson;

margin-top: 10px;
margin-left: 20px;
font-size: 20px;
`
const Container = styled.div`
  width: 100vw;
  
  
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper=styled.div`
width: 35%;
  padding: 20px;
  margin-left: 30px;
  background-color: whitesmoke;
  border-radius: 20px;


`

const Title=styled.h1`
font-size: 30;
font-weight: bold;
margin-top: 30px;
margin-bottom: 20px;
text-align: center;

`
const Lable=styled.h5`
margin-top: 5px;
margin-top: 5px;

`
const Form=styled.form`


`
const Input=styled.input`
flex: 1;
  min-width: 98%;

  padding: 10px;
  border: 1px solid gray;
  border-radius: 10px;
  margin-top: 5px;


`
const TextArea=styled.textarea`
 width: 400px;
  height: 100px;
  padding: 20px;
  border:  solid gray ;
  border-radius: 10px;


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
margin-top: 10px;
`
const Error=styled.p`
color:red;
`
const Post = () => {
  const navigate=useNavigate()
  const location=useLocation()
  const currentUser=useSelector((state)=>state.currentUser)
  const [error,setError]=useState('')
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [budget,setBudget]=useState(0)
  const [deadline,setDeadline]=useState(null)
  const [subjects,setSubjects]=useState([])
  //const [Options,setOptions]=useState([{name: 'Physics', id: 1},{name: 'Computer', id: 2}])
  

  const getJob=async()=>{
    const body={id:location.state}
      const result=await axios.post('/getjob',body)
      const {job}=result.data;
      setTitle(job.title)
      setDescription(job.description)
      setBudget(job.budget)
      
  }
  useEffect(()=>{
    if(location.state!==null){
      getJob()
    }
  },[])
 
  
  const onSelect=(selectedList, selectedItem) =>{
    console.log(selectedList)
    console.log(selectedItem)
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
    if(title.length>48){
      setError("Title Length should be 50 characters.")
    }
    else{
      setError('')
    }
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
const handleUpdate=async(e)=>{
e.preventDefault()
if(title.length<1 || description.length<1 || budget==0 || subjects.length<1 || deadline==null ){
  setError('Please fill all the fields.')
  return
}

const today=new Date()
const user=new Date(deadline)
if(today>user){
 setError('Deadline must be after current date and time.')
 return
}
let body={
  post:{
  _id:location.state,
  title,
  description,
  budget,
  deadline,
  subjects,
  user_id:currentUser.user._id}
}
const res=await axios.put('http://localhost:5000/job',body)
if(res.error){
  setError(res.message)
}
else{
   setError('')
   navigate('/myposts')
   
}
}
const handleSubmit=async(e)=>{
e.preventDefault()
if(title.length<1 || description.length<1 || budget==0 || subjects.length<1 || deadline==null ){
  setError('Please fill all the fields.')
  return
}

const today=new Date()
const user=new Date(deadline)
if(today>user){
 setError('Deadline must be after current date and time.')
 return
}


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
        <StudentNavbar/>
        <Title>Post Your requirements</Title>
        <Container>
<Wrapper>
            

            <Form>
            
                <Lable>Title:</Lable>
                <input className="job_title_input" required type="text" value={title} maxlength="50" 
                onChange={handleTitle}/>
                <Lable>Description</Lable>
                <TextArea value={description} onChange={handleDescription}/>
                <Lable>Budget In USD:</Lable>
                <Input min={0} type="number" value={budget} onChange={handleBudget}/>
                <Lable>Subjects</Lable>
                <Multiselect
                
                  options={Options} // Options to display in the dropdown
                  selectedValues={Options[0]} // Preselected value to persist in dropdown
                 onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  />
                <Lable>Bidding Time (closing):</Lable>
                <Input  onChange={handleDeadline} value={deadline} type="datetime-local"/>
                <Error>{error}</Error>
                {location.state!==null?
                <Button onClick={handleUpdate}>Update</Button>:
                <Button onClick={handleSubmit}>Submit</Button>}
                
            </Form>
            </Wrapper>
        </Container>
      
            
        </div>
    )
}
export default Post