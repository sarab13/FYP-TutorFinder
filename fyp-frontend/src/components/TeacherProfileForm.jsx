
import React,{useState} from 'react'
import styled from "styled-components"
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import { toggleProfileStatus } from '../redux/actions/action';
import { useNavigate,Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

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



const TeacherProfileForm = () => {
  const currentUser=useSelector((state)=>state.currentUser)

  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [profile,setProfile]=useState({
    img:'',
    name:'',
    description:'',
    gender:'',
    dob:'',
    location:'',
    ph_no:'',
    qualification:'',
    experience:'',
    fee:0
  })

  const [uploadedImage,setUploaded] = useState('');
  const imageUploader = React.useRef(null);
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
  const handleImageUpload = e => {
    setProfile({...profile,img:e.target.files[0]})
  };

  const handleChange=(e)=>{
   const key=e.target.name;
   const value=e.target.value;
   setProfile({...profile,[key]:value})
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const formData=new FormData();
    formData.append('profileImg', profile.img)
    formData.append('name',profile.name)
    formData.append('description',profile.description)
    formData.append('gender',profile.gender)
    formData.append('dob',profile.dob)
    formData.append('location',profile.location)
    formData.append('ph_no',profile.ph_no)
    formData.append('qualification',profile.qualification)
    formData.append('experience',profile.experience)
    formData.append('fee',profile.fee)
    //subjects.forEach(function (element) {
      //data.append('subjects[][item]', element.item);
  //})
    formData.append('subjects',JSON.stringify(subjects))
    formData.append('tutorId',currentUser.user._id)
    axios.post("http://localhost:5000/updateprofile", formData).then(res => {
        if(res.data.error){
          navigate('/updateprofile')
        }
        else{
          dispatch(toggleProfileStatus(true))
          navigate('/myprofile')
        }
    })
  }

  if(!currentUser.isLoggedIn){
    return <Navigate to='/login'/>
    }
  else
    return (
        <div>
        <Logo>Tutor Finder</Logo>
        <Container>
            <Form>
            <Title>Enter Your Details </Title>
                <Lable>Profile Pic:</Lable>
                <input onChange={handleImageUpload} ref={imageUploader} type="file" accept="image/*" multiple = "false" />
                <div style={{width:'200px', height:'200px'}}>
                <img
                 src={uploadedImage}
                 style={{
                 width: "100%",
                 height: "100%",
                 position: "acsolute"
                 }}
                
        /></div>
                <Lable>Name</Lable>
                <Input type="text" name='name' onChange={handleChange} value={profile.name}/>
                <Lable>Description</Lable>
                <TextArea name='description' onChange={handleChange} value={profile.description}></TextArea>
                <Lable>Gender</Lable>
                
                <select id="gender" onChange={handleChange} name="gender">
                <option value="">Select</option>

    <option value="Male">male</option>
    <option value="Femail">femail</option>
   
  </select>
  
  <Lable>Date of birth</Lable>
  <Input type="date" name="dob" onChange={handleChange} value={profile.dob}/>
  <Lable>Location</Lable>
  <Input type="text" name="location" onChange={handleChange} value={profile.location}/>
  <Lable>Phone No</Lable>
  <Input type="tel" name="ph_no" onChange={handleChange} value={profile.ph_no} />
  <Lable>Education</Lable>
  <Input type="text" name="education" onChange={handleChange} value={profile.qualification}/>
  <Lable>Subjects</Lable>
                <Multiselect
                  options={Options} // Options to display in the dropdown
                  selectedValues={Options[0]} // Preselected value to persist in dropdown
                 onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  />
  <Lable>Teaching Experience</Lable>
  <Input type="text" name="experience" onChange={handleChange} value={profile.experience}/>
  <Lable>Fee</Lable>
  <Input type="number" name="fee" onChange={handleChange} value={profile.fee}/>
  <Button onClick={handleSubmit}>Submit</Button>
                
            </Form>
           
            
        </Container>
      
            
        </div>
    )
}

export default TeacherProfileForm
