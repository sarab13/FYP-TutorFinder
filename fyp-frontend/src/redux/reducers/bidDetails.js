import { SAVE_BID_DETAILS } from "../actionTypes/types";

const INITIAL_STATE = {
    myBids:[] 
};

const reducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case SAVE_BID_DETAILS:

           return {
             ...state, myBids:[...state.myBids,action.payload]
           };
       
         default: return state;

    }

};

export default reducer;