
import React,{useState,useEffect} from 'react'
import styled from "styled-components"
import Select from 'react-select'
import { EducationOptions } from './EducationOptions'
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import { toggleProfileStatus,setDP } from '../../redux/actions/action';
import { useNavigate,Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PhoneInput,{getCountries} from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import StudentNavBar from './StudentNavbar'
import SpecialNavBar from '../Teacher/SpecialNavBar'
import countryList from 'react-select-country-list'

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
margin-bottom:10px;

`
const Form=styled.form`


`
const Input=styled.input`
flex: 1;
  min-width: 40%;
  margin-bottom:15px;
  border-radius:10px;

  padding: 10px;
  border: 1px solid gray;


`
const TextArea=styled.textarea`
 width: 400px;
  height: 100px;
  padding: 10px;
  border: 1px solid gray;
  border-radius:10px;

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



const StudentProfileForm = () => {
  const currentUser=useSelector((state)=>state.currentUser)
   let location=useLocation()
   const options = React.useMemo(() => countryList().getData(), [])
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [profile,setProfile]=useState({
    img:'',
    name:'',
    description:'',
    gender:'',
    dob:'',
    location:'Pakistan',
    qualification:'',
    experience:0,
    fee:0
  })
  const [phoneNo, setPhoneNo] = useState()

  const [uploadedImageUrl,setUploadedImageUrl] = useState('');
  const imageUploader = React.useRef(null);
  const [subjects,setSubjects]=useState([])
  const [Error,SetError]=useState("")
  const [qualificationDropDown,setQualirficationDropDown]=useState()
  const [locationDropDown,setLocationDropDown]=useState()
  const [Options,setOptions]=useState([{name: 'Physics', id: 1},{name: 'Computer', id: 2}])
  const getProfileInfo=async()=>{
    const result=await axios.post('/stdmyprofile',{studentId:currentUser.user._id})
    if(!result.data.error){
      
      const {dob,gender,location,name,profile_pic,qualification}=result.data.myProfile;
      let newDOB=new Date(dob)
      let dobb=newDOB.getFullYear()+'-'+newDOB.getMonth()+'-'+newDOB.getDate();
       //alert(dobb.toString())
      setProfile({
        ...profile,
        name,
       // description,
        gender,
        dob:dobb.toString(),
        location,
        qualification,
       // experience,
        //fee,
        img:profile_pic
               })
        setUploadedImageUrl(profile_pic)
      //  setSubjects([...subjects])
        setQualirficationDropDown(EducationOptions.filter(option=>option.value==qualification))
        setLocationDropDown(options.filter((option)=>option.label==location))
    }
  }
  
  useEffect(() => {
    if(location.state){
        getProfileInfo()
    }
    
  }, [])
  const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
  );
  const onSelect=(selectedList, selectedItem) =>{
    SetError('')
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
    let reader=new FileReader()
    reader.onloadend = () => {
      setUploadedImageUrl(reader.result)
    }
    reader.readAsDataURL(e.target.files[0])
    setProfile({...profile,img:e.target.files[0]})
  };

  const handleChange=(e)=>{
    SetError('')
   const key=e.target.name;
   const value=e.target.value;
   setProfile({...profile,[key]:value})
   
  }
  const handleSubmit=(e)=>{
    alert(profile.img)
    e.preventDefault()
    if(!profile.name || !profile.qualification  || !profile.img || !profile.gender || !profile.dob  || !profile.location){
      SetError('Please fill all the fields.');
      return
    }
    
    
    const formData=new FormData();
    formData.append('profileImg', profile.img)
    formData.append('name',profile.name)
    //formData.append('description',profile.description)
    formData.append('gender',profile.gender)
    formData.append('dob',profile.dob)
    formData.append('location',profile.location)
    //formData.append('ph_no',phoneNo)
    formData.append('qualification',profile.qualification)
    //formData.append('experience',profile.experience)
    //formData.append('fee',profile.fee)
    //subjects.forEach(function (element) {
      //data.append('subjects[][item]', element.item);
  //})
    //formData.append('subjects',JSON.stringify(subjects))
    formData.append('studentId',currentUser.user._id)
    if(location.state){
      axios.put("http://localhost:5000/stdeditprofile", formData).then(res => {
        if(res.data.error){
          navigate('/myprofile')
        }
        else{
         // dispatch(toggleProfileStatus(true))
         currentUser.user.profile_pic=uploadedImageUrl;
         dispatch(setDP(currentUser.user))
          navigate('/createjob')
        }
    })
    }
    else{
    axios.post("http://localhost:5000/stdupdateprofile", formData).then(res => {
        if(res.data.error){
          navigate('/stdupdateprofile')
        }
        else{
          dispatch(toggleProfileStatus(true))
          currentUser.user.profile_pic=uploadedImageUrl;
          dispatch(setDP(currentUser.user))

          navigate('/createjob')
        }
    })
  }
  }
  
  const educationHandler=(val)=>{
    setQualirficationDropDown(val)
    setProfile({...profile,qualification:val.value})
  }
  const changeHandler=(val)=>{
    setLocationDropDown(val)
    setProfile({...profile,location:regionNames.of(val.value)})
    //setProfile({...profile,location:val.value})
  }

  if(!currentUser.isLoggedIn){
    return <Navigate to='/login'/>
    }
  else
    return (
        <div>
        {location.state?<StudentNavBar/>:<SpecialNavBar/>}
        <Title>Enter Your Details </Title>
        <Container>
        <Wrapper>
            <Form>
            
                <Lable>Profile Pic*:</Lable>
                {uploadedImageUrl.length>0?<img className='profilepic' src={uploadedImageUrl} alt="dp"></img>:''}
                <input style={{marginBottom:'15px'}} onChange={handleImageUpload} ref={imageUploader} type="file" accept="image/*" multiple = "false" />
                
                <Lable>Full Name*:</Lable>
                <Input required  maxLength={25} type="text" name='name' onChange={handleChange} value={profile.name}/>
             {//   <Lable>Profile Description*:</Lable>
                //<TextArea required maxLength={100} name='description' onChange={handleChange} value={profile.description}></TextArea>
             }<Lable>Gender*:</Lable>
                
                <select style={{marginBottom:'15px'}} id="gender" value={profile.gender} onChange={handleChange} name="gender">
                <option value="">Select</option>

    <option value="Male">male</option>
    <option value="Femail">femail</option>
   
  </select>
  
  <Lable>Date of birth*:</Lable>
  <Input type="date" max={'2006-12-31'} defaultValue={profile.dob} name="dob" required onChange={handleChange} value={profile.dob}/>
  <Lable>Location*:</Lable>
  <Select  options={options} value={locationDropDown}  onChange={changeHandler} />

  {/*<Lable>Phone No*:</Lable>
  <PhoneInput
  style={{width:"20px"}}
     international
     countryCallingCodeEditable={false}
     initialValueFormat="national"

      placeholder="Enter phone number"
      value={phoneNo}
      onChange={setPhoneNo}
      onCountryChange={getCountryName}
      defaultCountry="PK"
      />
  */
    }
  <Lable style={{marginTop:'15px'}}>Education*:</Lable>
  <Select id="education"  options={EducationOptions} value={qualificationDropDown}  onChange={educationHandler} />
  {//<Lable>Subjects*:</Lable>
     //           <Multiselect
       //           options={Options} // Options to display in the dropdown
         //         selectedValues={[...subjects]} // Preselected value to persist in dropdown
           //      onSelect={onSelect} // Function will trigger on select event
             //     onRemove={onRemove} // Function will trigger on remove event
               //   displayValue="name" // Property name to display in the dropdown options
                 // />
 // <Lable style={{marginTop:'15px'}}>Teaching Experience*:</Lable>
  //</Wrapper>Input type="number" name="experience" min={0} onChange={handleChange} value={profile.experience}/>
  //</Container>/<Lable>Fee*: (In Dollars)</Lable>
  //</div><Input type="number" name="fee" min={2} onChange={handleChange} value={profile.fee}/>
  }<p style={{padding:'10px',color:'red',fontSize:'15px'}}>{Error}</p>
  <Button onClick={handleSubmit}>Submit</Button>
                
            </Form>
           
            </Wrapper>
        </Container>
      
            
        </div>
    )
}

export default StudentProfileForm
