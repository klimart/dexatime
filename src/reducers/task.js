import { ADD_TASK } from '../actions/types';

const initialState = [
    {id: 1, date: '1-05-2020', time: 300, description: 'task 1 description', actions: 'start'},
    {id: 2, date: '1-05-2020', time: 300, description: 'task 2 description', actions: 'start'},
    {id: 3, date: '1-05-2020', time: 300, description: 'task 3 description', actions: 'start'},
    {id: 4, date: '1-05-2020', time: 300, description: 'task 4 description', actions: 'start'},
    {id: 5, date: '1-05-2020', time: 300, description: 'task 5 description', actions: 'start'},
    {id: 6, date: '1-05-2020', time: 300, description: 'task 6 description', actions: 'start'},
];


export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case ADD_TASK:
            return [...state, payload];
        default:
            return state;
    }
}
