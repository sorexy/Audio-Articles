import searchbarReducer from './search_bar';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    mySb: searchbarReducer
})

export default allReducers;
