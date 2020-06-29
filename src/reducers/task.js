import {
    ADD_TASK,
    CHANGE_TASK_ORDER,
    SELECT_LAST_TASK,
    SET_ACTIVE_TASK,
    UPDATE_TASK
 } from '../actions/types';

const initialState = {
    activeTaskId: null,
    sort: {
        field: 'idx',
        direction: 'desc'
    },
    tasks: [
        {id: 1, idx: 1, date: '1-05-2020', time: 300, description: 'task 1 description', actions: 'duplicate'},
        {id: 2, idx: 2, date: '1-05-2020', time: 300, description: 'task 2 description', actions: 'duplicate'},
        {id: 3, idx: 3, date: '1-05-2020', time: 300, description: 'task 3 description', actions: 'duplicate'},
        {id: 4, idx: 4, date: '1-05-2020', time: 300, description: 'task 4 description', actions: 'duplicate'},
        {id: 5, idx: 5, date: '1-05-2020', time: 300, description: 'task 5 description', actions: 'duplicate'},
        {id: 6, idx: 6, date: '1-05-2020', time: 300, description: 'task 6 description', actions: 'duplicate'},
    ]
};

const newTaskTemplate = {
    id: '', idx: '', date: '', time: 0, description: '', actions: 'start'
};

const getMaxField = (tasks, field) => {
    return tasks.reduce((result, current) => {
        return result && result > current[field] ? result : current[field];
    }, null);
};

export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case ADD_TASK:
            let maxIdx = getMaxField(state.tasks, 'idx');
            let maxId = getMaxField(state.tasks, 'id');
            let newTaskId = maxId + 1;
            let newTask = {
                ...newTaskTemplate,
                id: newTaskId,
                idx: maxIdx + 1,
                date: new Date()
            };

            return {
                ...state,
                activeTaskId: newTaskId,
                tasks: [...state.tasks, newTask]
            };

        case CHANGE_TASK_ORDER:
            let {idx1, idx2} = payload;
            if (idx1 === idx2) {
                return state;
            }
            let dirUp = idx2 < idx1;
            let dirDown = idx2 > idx1;

            return {
                ...state,
                tasks: state.tasks.map((el) => {
                    switch (true) {
                        case dirDown && el.idx > idx2:
                        case dirDown && el.idx < idx1:
                        case dirUp && el.idx < idx2:
                        case dirUp && el.idx > idx1:
                            return el;
                        case el.idx === idx1:
                            return {...el, idx: idx2}
                        case dirDown:
                            return {...el, idx: --el.idx }
                        case dirUp:
                            return {...el, idx: ++el.idx }
                        default:
                            return el;
                    }
                })
            };

        case SELECT_LAST_TASK:
            let lastTaskIdx = getMaxField(state.tasks, 'idx');

            return {
                ...state,
                activeTaskId: parseInt(lastTaskIdx)
            };

        case SET_ACTIVE_TASK:
            let {id} = payload;

            return {
                ...state,
                activeTaskId: parseInt(id)
            };

        case UPDATE_TASK:
            let {params} = payload;
            let taskId = payload.id;

            return {
                ...state,
                tasks: state.tasks.map((el) => {
                    switch (true) {
                        case el.id === taskId:
                            return {...el, ...params};
                        default:
                            return el;
                    }
                })
            };

        default:
            return state;
    }
}
