import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask } from '../actions/task';

const Header = ({addTask, activeTask}) => {
    let {id, idx, date, time, description} = activeTask;

    return (
        <div className="header">
            <div className="actions-before">
                <button onClick={addTask}>Start</button>
            </div>
            <div className="active-task">
                <div>
                    <span>{time}</span>
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
}

const mapStateToProps = state => {
    let activeTask = state.task.tasks.find(
        (task) => (parseInt(task.id) === parseInt(state.task.activeTaskId))
    );

    // Active task is not set
    activeTask = activeTask ? activeTask : {};

    return {activeTask};
};

export default connect(mapStateToProps, { addTask })(Header);
