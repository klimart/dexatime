import {
    ADD_TASK,
    CHANGE_TASK_ORDER
 } from './types';

export const addTask = () => dispatch => {
    dispatch({
        type: ADD_TASK
    });
};

export const changeTaskOrder = (idx1, idx2) => dispatch => {
    dispatch({
        type: CHANGE_TASK_ORDER,
        payload: { idx1, idx2 }
    });
};
