import './orders.css'
import React,{useState,useEffect} from 'react'
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import  AdminNavbar from '../AdminNavbar';
import axios from 'axios'



function Orders() {
    const [orderInfo,setOrdersInfo]=useState({
        active:{
            priceTotal:0,
            count:0,
        },
        complete:{
            priceTotal:0,
            count:0,
        },
        cancell:{
            priceTotal:0,
            count:0,
        }

    })


    const getOrdersInfo=async()=>{
        const result=await axios.get('/ordersinfo')
        if(!result.data.error){
            const {ordersInfo}=result.data;
            setOrdersInfo({
                ...orderInfo,
                active:{
                    priceTotal:ordersInfo.active.priceTotal,
                    count:ordersInfo.active.count
                },
                complete:{
                    priceTotal:ordersInfo.complete.priceTotal,
                    count:ordersInfo.complete.count
                },
                cancel:{
                    priceTotal:ordersInfo.cancel.priceTotal,
                    count:ordersInfo.cancel.count
                },
            })
        }

    }

useEffect(()=>{
getOrdersInfo()
},[])
  return (
      <>
      <AdminNavbar/>
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Active</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.active.priceTotal}</span>
          <span className="featuredMoneyRate">
        {orderInfo.active.count} 
          </span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cancelled</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.cancel.priceTotal}</span>
          <span className="featuredMoneyRate">
            {orderInfo.cancel.count}
          </span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Completed</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderInfo.complete.priceTotal}</span>
          <span className="featuredMoneyRate">
            {orderInfo.complete.count}
          </span>
        </div>
      </div>
    </div>
    </>
  );
}

export default Orders;