import { SIGNIN } from '../actionTypes/types';
import { TOGGLE_COMPLETE_PROFILE } from '../actionTypes/types';

    export const signIn = (user) => {

        return {

            type: SIGNIN,
            payload:user

        };

    };

    export const toggleProfileStatus=(status)=>{
        return {
            type:TOGGLE_COMPLETE_PROFILE,
            payload:status
        }
    }

    