import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
    const [dndIndex, sedDndIndex] = useState(null);
    const [dndOverIndex, setDndOverIndex] = useState(null);

    let maxIdx;
    let tableRows = tasks.map(task => {
        maxIdx = !maxIdx || task.idx > maxIdx ? task.idx : maxIdx;

        return (
            <TaskItem
                key={task.id}
                data={task}
                dndIdx={{dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex}} />
        )
    });

    let emptyTaskData = {
        id: '',
        idx: ++maxIdx,
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
    tasks: state.task.sort((a, b) => {
        return a.idx > b.idx ? 1 : -1;
    })
});

export default connect(mapStateToProps)(TaskList);
