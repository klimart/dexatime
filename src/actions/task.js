import { ADD_TASK } from './types';

export const addTask = (task) => dispatch => {
    dispatch({
        type: ADD_TASK,
        payload: { task }
    });
};
