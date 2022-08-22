import { LOGOUT, SAVE_BID_DETAILS, SIGNIN } from '../actionTypes/types';
import { TOGGLE_COMPLETE_PROFILE } from '../actionTypes/types';

    export const signIn = (user) => {

        return {

            type: SIGNIN,
            payload:user

        };

    };
    
    export const setDP=(user)=>{
        return{
            type:'SETDP',
            payload:user
        }
    }
    export const toggleProfileStatus=(status)=>{
        return {
            type:TOGGLE_COMPLETE_PROFILE,
            payload:status
        }
    }

    export const saveBidDetails=(bid)=>{
        return {
            type:SAVE_BID_DETAILS,
            payload:bid
        }
    }

    export const logoutUser=()=>{
        return {
            type:LOGOUT
        }
    }