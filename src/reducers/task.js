import {
    ADD_TASK,
    CHANGE_TASK_ORDER
 } from '../actions/types';

const initialState = [
    {id: 1, idx: 1, date: '1-05-2020', time: 300, description: 'task 1 description', actions: 'start'},
    {id: 2, idx: 2, date: '1-05-2020', time: 300, description: 'task 2 description', actions: 'start'},
    {id: 3, idx: 3, date: '1-05-2020', time: 300, description: 'task 3 description', actions: 'start'},
    {id: 4, idx: 4, date: '1-05-2020', time: 300, description: 'task 4 description', actions: 'start'},
    {id: 5, idx: 5, date: '1-05-2020', time: 300, description: 'task 5 description', actions: 'start'},
    {id: 6, idx: 6, date: '1-05-2020', time: 300, description: 'task 6 description', actions: 'start'},
];


export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case ADD_TASK:
            payload.id = payload.idx; // ToDo change after DB management added
            return [...state, {...payload, id: payload.idx}];

        case CHANGE_TASK_ORDER:
            let {idx1, idx2} = payload;
            if (idx1 === idx2) {
                return state;
            }
            let dirUp = idx2 < idx1;
            let dirDown = idx2 > idx1;

            return state.map((el) => {
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
            });

        default:
            return state;
    }
}
