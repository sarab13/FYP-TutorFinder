import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';


import userReducer from './reducers/userReducer';
import teacherProfileReducer from './reducers/teacherProfileReducer'
import myBidsReducer from './reducers/bidDetails'

const persistConfig = {
    key: 'tutorFinder',
    storage,
};

const reducers= combineReducers({

    currentUser: userReducer,
    tProfileStatus:teacherProfileReducer,
    Bids:myBidsReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);

export default persistedReducer