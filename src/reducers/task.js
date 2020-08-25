import {
    ADD_TASK,
    CHANGE_TASK_ORDER,
    LOAD_TASK_LIST,
    SELECT_LAST_TASK,
    SET_ACTIVE_TASK,
    START_TASK,
    STOP_TASK,
    UPDATE_TASK
 } from '../actions/types';

const initialState = {
    activeTaskId: null,
    inProgress: false,
    sort: {
        field: 'idx',
        direction: 'desc'
    },
    tasks: []
};

// Task items fields
// id: '', idx: '', date: '', time: 0, description: '', start: ''

const getMaxField = (tasks, field) => {
    return tasks.reduce((result, current) => {
        return result && result > current[field] ? result : current[field];
    }, null);
};

export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case ADD_TASK:
            if (state.inProgress) {
                return state;
            }

            return {
                ...state,
                activeTaskId: payload.id,
                tasks: [...state.tasks, payload]
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

        case LOAD_TASK_LIST:
            return {
                ...state,
                tasks: payload
            };

        case SELECT_LAST_TASK:
            let lastTaskIdx = getMaxField(state.tasks, 'idx');

            return {
                ...state,
                activeTaskId: parseInt(lastTaskIdx)
            };

        case SET_ACTIVE_TASK:
            if (state.inProgress) {
                return state;
            }

            let {id} = payload;

            return {
                ...state,
                activeTaskId: parseInt(id)
            };

        case START_TASK:
            if (!state.activeTaskId) {
                return state;
            }

            return {
                ...state,
                inProgress: true,
                activeTaskId: parseInt(payload.id)
            };

        case STOP_TASK:
            if (!state.activeTaskId) {
                return state;
            }


            return {
                ...state,
                inProgress: false
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
