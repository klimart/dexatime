import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import alert from './alert';

const initialState = {};

const rootReducer = combineReducers({
    alert
});

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
);

export default store;
