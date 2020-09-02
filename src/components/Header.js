import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask, startTask, stopTask } from '../actions/task';
import { timeFormatter } from '../utils/timeFormatter';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';

const Header = ({addTask, activeTask, activeTaskId, startTask, stopTask, inProgress}) => {
    let {id, idx, date, time, description} = activeTask;

    return (
        <div className="header">
            <div className="actions-before" title={inProgress ? 'Pause Task' : 'Start Task'}>
                <button>
                    {inProgress
                        ? <PauseIcon
                            color="primary"
                            fontSize="large"
                            onClick={e => stopTask(activeTaskId)} />
                        : <PlayArrowIcon
                            color={activeTaskId ? 'primary' : 'disabled'}
                            fontSize="large"
                            onClick={e => startTask(activeTaskId)} />
                    }
                </button>
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
                <button
                    title="Add New Task"
                    className={inProgress ? 'add-new-task disabled' : 'add-new-task'}
                    onClick={e => {if (inProgress) return; addTask()}}>
                    <AddIcon />
                    <span>New</span>
                </button>
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
