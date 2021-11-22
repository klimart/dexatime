import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { addTask, startTask, stopTask, updateTask } from '@Client/actions/task';
import { timeFormatter } from '@Client/utils/timeFormatter';
import render from '@Client/utils/renderer';

const Header = ({addTask, tasks, activeTaskId, startTask, stopTask, inProgress, updateTask}) => {
    const getActiveTask = () => {
        const runningTask = tasks.find((task) => (
            parseInt(task.id) === activeTaskId
        ));

        return runningTask ? runningTask : {};
    };

    const getDescription = () => {
        const activeTask = getActiveTask();
        return activeTask.description;
    }

    const getTime = () => {
        const activeTask = getActiveTask();
        return timeFormatter(activeTask.time);
    }

    const updateActiveTaskAction = () => (
        updateTask({
            id: activeTaskId,
            params: {}
        })
    );

    useEffect(() => {
        let interval = null;
        if (inProgress && activeTaskId) {
            updateActiveTaskAction();
            interval = setInterval(() => {
                updateActiveTaskAction()
            }, 250);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [inProgress, activeTaskId]);

    return (
        <div className="header-wrapper">
            <div className="header">
                <div className="actions-before">
                    <Button
                        variant="outlined"
                        color={inProgress ? 'primary' : 'secondary'}
                        onClick={e => inProgress ? stopTask(activeTaskId) : startTask(activeTaskId)}>
                        {inProgress
                            ? <Tooltip title="Pause" arrow>
                                <PauseIcon
                                    color="primary"
                                    fontSize="large" />
                            </Tooltip>
                            : <Tooltip title="Start" arrow>
                                <PlayArrowIcon
                                    color={activeTaskId ? 'primary' : 'secondary'}
                                    fontSize="large" />
                            </Tooltip>
                        }
                    </Button>
                </div>
                <div className="active-task">
                    <div className="active-time">
                        <span>{getTime()}</span>
                    </div>
                    <div className="active-description">
                        <span>{render(getDescription())}</span>
                    </div>
                </div>
                <div className="actions-after">
                    <Tooltip title="Add New Task" arrow>
                        <Button
                            variant="outlined"
                            color={inProgress ? 'secondary' : 'primary'}
                            className={inProgress ? 'add-new-task secondary' : 'add-new-task'}
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
    tasks: PropTypes.array.isRequired,
    inProgress: PropTypes.bool.isRequired,
    activeTaskId: PropTypes.number.isRequired,
    addTask: PropTypes.func.isRequired,
    startTask: PropTypes.func.isRequired,
    stopTask: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    tasks: state.task.tasks,
    activeTaskId: parseInt(state.task.activeTaskId),
    inProgress: Boolean(state.task.inProgress)
});

export default connect(mapStateToProps, { addTask, startTask, stopTask, updateTask })(Header);
