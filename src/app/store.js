import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
//import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import userReducer from './extras/reducers/userReducer';
import searchReducer from './extras/reducers/searchReducer';
import genInfoReducer from './extras/reducers/genInfoReducer';

const middleware = applyMiddleware(promise(), thunk);
const allReducers = combineReducers({
    user: userReducer,
    search: searchReducer,
    genInfo: genInfoReducer
})
const store = createStore(
    allReducers, 
    middleware 
)

export default store