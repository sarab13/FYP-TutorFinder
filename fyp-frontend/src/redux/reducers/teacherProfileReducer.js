import { TOGGLE_COMPLETE_PROFILE } from "../actionTypes/types";
const INITIAL_STATE = {
    isCompleteProfile:false
 };

 const reducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case TOGGLE_COMPLETE_PROFILE:

           return {

             ...state, isCompleteProfile:action.payload,

           };
       
         default: return state;

    }

};

export default reducer;