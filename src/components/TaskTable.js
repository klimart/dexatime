import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskRows from '@Client/components/TaskRows';
import HeartBeat from '@Client/services/HeartBeat';
import { selectLastTask } from '@Client/actions/task';

const TaskTable = ({ activeTaskId, tasks, selectLastTask }) => {
    const [dndIndex, sedDndIndex] = useState(null);
    const [dndOverIndex, setDndOverIndex] = useState(null);
    const hiddenColumns = ['idx', 'id'];

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
                        {!hiddenColumns.includes('id') && <th className="column-id">id</th>}
                        {!hiddenColumns.includes('idx') && <th className="column-idx">idx</th>}
                        {!hiddenColumns.includes('date') && <th className="column-date">date</th>}
                        {!hiddenColumns.includes('time') && <th className="column-time">time</th>}
                        {!hiddenColumns.includes('description') && <th className="column-description">description</th>}
                        {!hiddenColumns.includes('actions') && <th className="column-actions">actions</th>}
                    </tr>
                </thead>
                <tbody>
                    <TaskRows
                        tasks={tasks}
                        dndIndex={dndIndex}
                        sedDndIndex={sedDndIndex}
                        dndOverIndex={dndOverIndex}
                        setDndOverIndex={setDndOverIndex}
                        hiddenColumns={hiddenColumns} />
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
