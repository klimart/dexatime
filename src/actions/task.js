import {
    ADD_TASK,
    CHANGE_TASK_ORDER,
    SELECT_LAST_TASK,
    SET_ACTIVE_TASK,
    START_TASK,
    STOP_TASK,
    UPDATE_TASK
 } from './types';

export const addTask = () => dispatch => {
    dispatch({
        type: ADD_TASK
    });
};

export const selectLastTask = () => dispatch => {
    dispatch({
        type: SELECT_LAST_TASK
    });
};

export const startTask = () => dispatch => {
    dispatch({
        type: START_TASK
    });
};

export const stopTask = () => dispatch => {
    dispatch({
        type: STOP_TASK
    });
};

export const updateTask = (data) => dispatch => {
    dispatch({
        type: UPDATE_TASK,
        payload: {
            id: data.id,
            params: data.params
        }
    });
};

export const changeTaskOrder = (idx1, idx2) => dispatch => {
    dispatch({
        type: CHANGE_TASK_ORDER,
        payload: { idx1, idx2 }
    });
};

export const setActiveTask = id => dispatch => {
    dispatch({
        type: SET_ACTIVE_TASK,
        payload: {id}
    });
};
