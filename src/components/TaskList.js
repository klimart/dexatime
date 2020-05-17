import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
    let idx = 0;
    let tableRows = tasks.map(task => {
        idx++;
        task.idx = idx;
        return (
            <TaskItem key={idx} data={task} />
        )
    });

    let emptyTaskData = {
        id: '',
        idx: ++idx,
        data: '',
        time: '',
        description: '',
        actions: ''
    };
    let emptyTask = <TaskItem data={emptyTaskData} />;

    return (
        <table className="tasks-list">
            <thead>
                <tr>
                    <th>id</th>
                    <th>idx</th>
                    <th>date</th>
                    <th>time</th>
                    <th>description</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>
            {tableRows}
            {emptyTask}
            </tbody>
        </table>
    );
};

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    tasks: state.task
});

export default connect(mapStateToProps)(TaskList);
