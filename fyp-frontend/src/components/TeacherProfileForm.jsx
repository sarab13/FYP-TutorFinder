
import React,{useState,useEffect} from 'react'
import styled from "styled-components"
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import { toggleProfileStatus } from '../redux/actions/action';
import { useNavigate,Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PhoneInput from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'



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

const Title=styled.h2`
font-size: 50;
font-weight: bold;
margin-top: 30px;
margin-bottom: 20px;
text-align: center;

`
const Lable=styled.h5`
font-weight: bold;

`
const Form=styled.form`


`
const Input=styled.input`
flex: 1;
  min-width: 40%;

  padding: 10px;
  border: 1px solid gray;


`
const TextArea=styled.textarea`
 width: 400px;
  height: 100px;
  padding: 10px;
  border: 1px solid gray;


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
   let location=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [profile,setProfile]=useState({
    img:'',
    name:'',
    description:'',
    gender:'',
    dob:'',
    location:'',
    
    qualification:'',
    experience:'',
    fee:0
  })
  const [phoneNo, setPhoneNo] = useState()

  const [uploadedImage,setUploaded] = useState('');
  const imageUploader = React.useRef(null);
  const [subjects,setSubjects]=useState([])
  const [Error,SetError]=useState("")
  const [dobError,setDobError]=useState('')
  const [Options,setOptions]=useState([{name: 'Physics', id: 1},{name: 'Computer', id: 2}])
  useEffect(() => {
    if(location.state){
      setProfile({...profile,...location.state})
    }
  }, [])
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

   if(key=="dob"){
    const date=new Date(value)
    const difference=2022-date.getFullYear();
    if(difference<15){
      setDobError("You must be 15 Years old")
      
    }
    else{
      setDobError('')
    }
    
  }
   setProfile({...profile,[key]:value})
   
  }
  const handleSubmit=(e)=>{

    e.preventDefault()
    if(!profile.name || !profile.qualification || !profile.description || !profile.img || !profile.gender || !profile.dob || !phoneNo || !profile.location){
      SetError('please enter all data');
      return
    }
    if(profile.description.length<198){
      SetError(" Minimum description length should be 200 characters.")
      return
    }
    if(!isPossiblePhoneNumber(phoneNo)){
      SetError("phone no is invalid")
      return
    }
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
        
        <Title>Enter Your Details </Title>
        <Container>
        <Wrapper>
            <Form>
            
                <Lable>Profile Pic:</Lable>
                <input onChange={handleImageUpload} ref={imageUploader} type="file" accept="image/*" multiple = "false" />
                <div >
              </div>
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
  <p>{dobError}</p>
  <Lable>Location</Lable>
  <Input type="text" name="location" onChange={handleChange} value={profile.location}/>
  <Lable>Phone No</Lable>
  <PhoneInput
  style={{width:"20px"}}
     international
     countryCallingCodeEditable={false}
     initialValueFormat="national"

      placeholder="Enter phone number"
      value={phoneNo}
      onChange={setPhoneNo}
      defaultCountry="PK"
      />
  
  <Lable>Education</Lable>
  <Input type="text" name="qualification" onChange={handleChange} value={profile.qualification}/>
  <Lable>Subjects</Lable>
                <Multiselect
                  options={Options} // Options to display in the dropdown
                  selectedValues={Options[0]} // Preselected value to persist in dropdown
                 onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  />
  <Lable>Teaching Experience</Lable>
  <Input type="number" name="experience" onChange={handleChange} value={profile.experience}/>
  <Lable>Fee</Lable>
  <Input type="number" name="fee" onChange={handleChange} value={profile.fee}/>
  <p>{Error}</p>
  <Button onClick={handleSubmit}>Submit</Button>
                
            </Form>
           
            </Wrapper>
        </Container>
      
            
        </div>
    )
}

export default TeacherProfileForm
