import * as uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

/**
 * Alert types - error, warning, info, success - match Material UI alert types.
 */
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(
        () =>
            dispatch({
                type: REMOVE_ALERT,
                payload: id
            }),
        timeout
    );
};
