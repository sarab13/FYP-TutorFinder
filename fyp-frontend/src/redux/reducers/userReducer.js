import { LOGOUT, SIGNIN } from '../actionTypes/types';


    const INITIAL_STATE = {
       isLoggedIn:false,
       user:{}
        
    };

    const reducer = (state = INITIAL_STATE, action) => {

        switch (action.type) {

            case SIGNIN:

               return {

                 ...state, isLoggedIn:true, user:action.payload,

               };
            case LOGOUT:
              return {
                  ...state,isLoggedIn:false,user:{}
              }
            case 'SETDP':
              return{
                ...state,user:action.payload
              }
             default: return state;

        }

    };

    export default reducer;