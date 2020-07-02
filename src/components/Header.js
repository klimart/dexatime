import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask, startTask, stopTask } from '../actions/task';
import { timeFormatter } from '../utils/timeFormatter';

const Header = ({addTask, activeTask, startTask, stopTask, inProgress}) => {
    let {id, idx, date, time, description} = activeTask;

    return (
        <div className="header">
            <div className="actions-before">
                {inProgress
                    ? <button onClick={stopTask}>Stop</button>
                    : <button onClick={startTask}>Start</button>}
            </div>
            <div className="active-task">
                <div>
                    <span>{timeFormatter(time)}</span>
                </div>
                <div>
                    <span>{description}</span>
                </div>
            </div>
            <div className="actions-after">
                <button onClick={addTask}>Add Task</button>
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
        inProgress: state.task.inProgress
    };
};

export default connect(mapStateToProps, { addTask, startTask, stopTask })(Header);
