import React from 'react';
import PropTypes from 'prop-types';
import TaskRow from './TaskRow';

const TaskRows = ({
    tasks,
    dndIndex,
    sedDndIndex,
    dndOverIndex,
    setDndOverIndex
}) => tasks.map(task => {
    return (
        <TaskRow
            key={task.id}
            data={task}
            dndIdx={{dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex}} />
    )
});

TaskRows.propTypes = {
    tasks: PropTypes.array,
    dndIndex: PropTypes.number,
    sedDndIndex: PropTypes.func,
    dndOverIndex: PropTypes.number,
    setDndOverIndex: PropTypes.func
};

export default TaskRows;
