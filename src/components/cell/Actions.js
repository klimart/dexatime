import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { deleteTask } from '../../actions/task';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

const Actions = ({taskId, deleteTask}) => (
    <Fragment>
        <DeleteForeverOutlinedIcon onClick={e => deleteTask(taskId)}/>
    </Fragment>
);

export default connect(null, {deleteTask})(Actions);
