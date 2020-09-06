import React, { useState } from 'react';
import { connect } from 'react-redux';
import { deleteTask } from '../../actions/task';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteConfirmationDialog from '../DeleteConfirmation';

const Actions = ({taskId, deleteTask}) => {
    const [isOpenDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const deleteTaskConfirmOpen = () => {
        setOpenDeleteConfirm(true);
    };

    const deleteTaskConfirmClose = () => {
        setOpenDeleteConfirm(false);
    };

    const deleteTaskAction = () => {
        deleteTask(taskId);
    };

    return (
        <div className="cell-action">
            <Tooltip title="Delete Task" arrow>
                <DeleteForeverOutlinedIcon
                    className="icon action-delete"
                    onClick={deleteTaskConfirmOpen} />
            </Tooltip>
            <DeleteConfirmationDialog
                    confirmClose={deleteTaskConfirmClose}
                    deleteHandle={deleteTaskAction}
                    isOpen={isOpenDeleteConfirm} />
            <Tooltip title="Drag Up/Down" arrow>
                <DragIndicatorIcon className="icon action-drag" fontSize="small" />
            </Tooltip>
        </div>
    );

};

export default connect(null, {deleteTask})(Actions);
