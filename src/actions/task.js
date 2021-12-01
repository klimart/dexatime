import { ipcRenderer } from 'electron';

import {
    ADD_TASK,
    CHANGE_TASK_ORDER,
    DELETE_TASK,
    GET_ALL_TASKS_COUNT,
    LOAD_TASK_LIST,
    LOAD_PART_TASK_LIST,
    SELECT_LAST_TASK,
    SET_ACTIVE_TASK,
    START_TASK,
    STOP_TASK,
    TASKS_LOADING,
    UPDATE_TASK
 } from './types';

export const addTask = () => dispatch => {
    ipcRenderer.send('task:new');
    ipcRenderer.once('task:added', (event, newTask) => {
        dispatch({
            type: ADD_TASK,
            payload: newTask
        });

        dispatch(getAllTasksCount());
    });
};

export const deleteTask = (taskId) => dispatch => {
    if (!taskId) {
        return;
    }

    ipcRenderer.send('task:delete', taskId);
    ipcRenderer.once('task:deleted', (event, result) => {
        if (result) {
            dispatch({
                type: DELETE_TASK,
                payload: {
                    id: taskId
                }
            });
        }

        dispatch(getAllTasksCount());
    });
};

export const loadTasks = () => dispatch => {
     // Load initial Tasks List Request to Electron
    ipcRenderer.send('task:list:load');
    ipcRenderer.on('task:list:loaded', (event, taskList) => {
        dispatch({
            type: LOAD_TASK_LIST,
            payload: taskList
        });

        dispatch(getAllTasksCount());
    });
};

export const loadTasksPartList = (offset = 0, limit = 30) => dispatch => {
    dispatch(setTasksLoading(true));
    // Load initial Tasks List Request to Electron
    ipcRenderer.send('task:part-list:load', {offset, limit});
    ipcRenderer.once('task:part-list:loaded', (event, taskList) => {
        dispatch({
            type: LOAD_PART_TASK_LIST,
            payload: taskList
        });

        dispatch(getAllTasksCount());
        dispatch(setTasksLoading(false));
    });
};

export const getAllTasksCount = () => dispatch => {
    ipcRenderer.send('task:list:count');
    ipcRenderer.on('task:list:counted', (event, tasksCount) => {
        dispatch({
            type: GET_ALL_TASKS_COUNT,
            payload: tasksCount
        });
    });
};

export const setTasksLoading = (isLoading) => dispatch => {
    dispatch({
        type: TASKS_LOADING,
        payload: isLoading
    });
};

export const selectLastTask = () => dispatch => {
    dispatch({
        type: SELECT_LAST_TASK
    });
};

export const startTask = (taskId) => dispatch => {
    if (!taskId) {
        return;
    }

    ipcRenderer.send('task:start', taskId);
    ipcRenderer.on('task:started', (event, result) => {
        if (result) {
            dispatch({
                type: START_TASK,
                payload: {
                    id: taskId
                }
            });
        }
    });
};

export const stopTask = (taskId) => dispatch => {
    ipcRenderer.send('task:stop', taskId);
    ipcRenderer.once('task:stopped', (event, result) => {
        if (result) {
            dispatch({
                type: STOP_TASK,
                payload: {
                    id: taskId
                }
            });
        }
    });
};

export const updateTask = (data) => dispatch => {
    // ToDo Process task data update.
    ipcRenderer.send('task:update', data);
    ipcRenderer.once('task:updated', (event, taskData) => {
        dispatch({
            type: UPDATE_TASK,
            payload: {
                id: taskData.id,
                params: taskData
            }
        });
    });
};

export const changeTaskOrder = (idx1, idx2) => dispatch => {
    // ToDo process order change
    ipcRenderer.send('task:change-order', {idx1, idx2});
    ipcRenderer.once('task:change-order:done', (event, result) => {
        dispatch({
            type: CHANGE_TASK_ORDER,
            payload: { idx1, idx2 }
        });
    });
};

export const setActiveTask = id => dispatch => {
    dispatch({
        type: SET_ACTIVE_TASK,
        payload: {id}
    });
};
