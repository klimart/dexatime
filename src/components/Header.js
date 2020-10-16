import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { addTask, startTask, stopTask } from '@Client/actions/task';
import { timeFormatter } from '@Client/utils/timeFormatter';

const Header = ({addTask, activeTask, activeTaskId, startTask, stopTask, inProgress}) => {
    let {id, idx, date, time, description} = activeTask;

    return (
        <div className="header-wrapper">
            <div className="header">
                <div className="actions-before">
                    <Button
                        variant="outlined"
                        color={inProgress ? 'primary' : 'disabled'}
                        onClick={e => inProgress ? stopTask(activeTaskId) : startTask(activeTaskId)}>
                        {inProgress
                            ? <Tooltip title="Pause" arrow>
                                <PauseIcon
                                    color="primary"
                                    fontSize="large" />
                            </Tooltip>
                            : <Tooltip title="Start" arrow>
                                <PlayArrowIcon
                                    color={activeTaskId ? 'primary' : 'disabled'}
                                    fontSize="large" />
                            </Tooltip>
                        }
                    </Button>
                </div>
                <div className="active-task">
                    <div className="active-time">
                        <span>{timeFormatter(time)}</span>
                    </div>
                    <div className="active-description">
                        <span>{description}</span>
                    </div>
                </div>
                <div className="actions-after">
                    <Tooltip title="Add New Task" arrow>
                        <Button
                            variant="outlined"
                            color={inProgress ? 'disabled' : 'primary'}
                            className={inProgress ? 'add-new-task disabled' : 'add-new-task'}
                            onClick={e => inProgress ? null : addTask()}
                            startIcon={<AddIcon />}>
                            New
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    activeTask: PropTypes.object.isRequired,
    addTask: PropTypes.func.isRequired,
    startTask: PropTypes.func.isRequired,
    stopTask: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    let activeTask = state.task.tasks.find(
        (task) => (parseInt(task.id) === parseInt(state.task.activeTaskId))
    );

    // Active task is not set
    activeTask = activeTask ? activeTask : {};

    return {
        activeTask,
        activeTaskId: parseInt(state.task.activeTaskId),
        inProgress: state.task.inProgress
    };
};

export default connect(mapStateToProps, { addTask, startTask, stopTask })(Header);
