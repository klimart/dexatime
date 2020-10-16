import React from 'react';
import PropTypes from 'prop-types';
import TaskRow from '@Client/components/TaskRow';

const TaskRows = ({
    tasks,
    dndIndex,
    sedDndIndex,
    dndOverIndex,
    setDndOverIndex,
    hiddenColumns
}) => tasks.map(task => {
    return (
        <TaskRow
            key={task.id}
            data={task}
            dndIdx={{dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex}}
            hiddenColumns={hiddenColumns} />
    )
});

TaskRows.propTypes = {
    tasks: PropTypes.array,
    dndIndex: PropTypes.number,
    sedDndIndex: PropTypes.func,
    dndOverIndex: PropTypes.number,
    setDndOverIndex: PropTypes.func,
    hiddenColumns: PropTypes.array
};

export default TaskRows;
