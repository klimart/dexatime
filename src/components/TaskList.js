import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import { selectLastTask } from '../actions/task';

const TaskList = ({ activeTaskId, tasks, selectLastTask }) => {
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

    useEffect(() => {
        if (!activeTaskId) {
            selectLastTask();
        }
    }, [activeTaskId]);

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
            </tbody>
        </table>
    );
};

TaskList.propTypes = {
    activeTaskId: PropTypes.number,
    tasks: PropTypes.array.isRequired,
    selectLastTask: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    activeTaskId: state.task.activeTaskId,
    tasks: state.task.tasks.sort((a, b) => {
        let orderField = state.task.sort.field;
        let orderDir = state.task.sort.direction;
        // List descending order
        switch (true) {
            case orderField === 'idx' && orderDir === 'desc':
                return a.idx > b.idx ? -1 : 1;
            case orderField === 'idx' && orderDir === 'asc':
            default:
                return a.idx > b.idx ? 1 : -1;
        }

    })
});

export default connect(
    mapStateToProps,
    {selectLastTask}
)(TaskList);
