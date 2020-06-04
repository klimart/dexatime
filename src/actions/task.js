import {
    ADD_TASK,
    CHANGE_TASK_ORDER,
    GET_TASKS
 } from './types';

export const addTask = (task) => dispatch => {
    dispatch({
        type: ADD_TASK,
        payload: { task }
    });
};

export const changeTaskOrder = (idx1, idx2) => dispatch => {
    dispatch({
        type: CHANGE_TASK_ORDER,
        payload: { idx1, idx2 }
    });
};

export const getTasks = () => dispatch => {
    dispatch({
        type: GET_TASKS,
        payload: {}
    });
};
