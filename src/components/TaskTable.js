import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskRows from './TaskRows';
import HeartBeat from '../services/HeartBeat';
import { selectLastTask } from '../actions/task';

const TaskTable = ({ activeTaskId, tasks, selectLastTask }) => {
    const [dndIndex, sedDndIndex] = useState(null);
    const [dndOverIndex, setDndOverIndex] = useState(null);

    useEffect(() => {
        if (!activeTaskId) {
            selectLastTask();
        }
    }, [activeTaskId]);

    return (
        <Fragment>
            <HeartBeat />
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
                    <TaskRows
                        tasks={tasks}
                        dndIndex={dndIndex}
                        sedDndIndex={sedDndIndex}
                        dndOverIndex={dndOverIndex}
                        setDndOverIndex={setDndOverIndex} />
                </tbody>
            </table>
        </Fragment>
    );
};

TaskTable.propTypes = {
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
)(TaskTable);
