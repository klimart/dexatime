import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import alert from './alert';
import task from './task';

const initialState = {};

const rootReducer = combineReducers({
    alert,
    task
});

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
);

export default store;
