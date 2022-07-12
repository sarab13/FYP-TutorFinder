import { combineReducers } from 'redux';


import userReducer from './reducers/userReducer';
import teacherProfileReducer from './reducers/teacherProfileReducer'


const rootReducer = combineReducers({

    currentUser: userReducer,
    tProfileStatus:teacherProfileReducer

});

export default rootReducer;