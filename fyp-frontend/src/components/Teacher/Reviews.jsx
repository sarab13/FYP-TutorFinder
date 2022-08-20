import React,{useState,useEffect} from 'react'
import TeacherNavBar from './TeacherNavBar'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import StarRatings from 'react-star-ratings';

import axios from 'axios'

const Span=styled.span`
font-weight:bold;
`
const Title=styled.h1`
margin-top:10px;
font-size:25px;
font-weight:bold;
text-align:center;
`
export default function Reviews() {
    const currentUser=useSelector((state)=>state.currentUser)
    const [reviews,setReviews]=useState([])
    const [avgRating,setAvgRating]=useState()


    const getReviews=async()=>{
        const result=await axios.get(`/myreviews?tutorId=${currentUser.user._id}`)
        if(!result.data.error){
            setReviews(result.data.reviews)
        }
        const result2=await axios.get(`/taveragerating?tutorId=${currentUser.user._id}`)
        if(!result2.data.error){
            setAvgRating(result2.data.average)
        }
    }
    useEffect(()=>{
       getReviews()
    },[])
  return (
    <>
    <TeacherNavBar/>
    <Title>My Reviews (Avg. Rating: {avgRating})</Title>

    <div className='reviewsContainer'>
      {reviews.length>0 && reviews.map((review)=>(
        <div className='review'>
            <div>
                <h3><Span>Student:</Span> {review.studentName}</h3>
                <StarRatings
            
          rating={review.stars}
          starRatedColor="orange"
        //  changeRating={changeRating}
        starDimension="25px"

          numberOfStars={5}
          name='rating'
        />
            </div>
            <div>
                <h5><Span>Feedback:</Span> {review.message}</h5>
                </div>
           </div> 
      ))}

    </div>
    </>
  )
}
