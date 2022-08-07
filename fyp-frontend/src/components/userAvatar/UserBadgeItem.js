import React,{useEffect,useState} from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const [expiry,setExpiry]=useState()
  useEffect(()=>{
    console.log(user)
    console.log(admin)
    var date1 = new Date(user.start_date);
    var date2 = new Date(user.end_date);
      
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    setExpiry(parseInt(Difference_In_Days))
  },[])
  return (
    <Badge

      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.username} (renewal : {expiry} days)
      {admin === user.subscriber_id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;