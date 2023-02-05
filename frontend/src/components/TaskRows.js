import React from 'react';
import PropTypes from 'prop-types';
import TaskRow from '@Client/components/TaskRow';
import { connect } from 'react-redux';

const TaskRows = (props) => {
    const {
        tasks,
        dndIndex,
        sedDndIndex,
        dndOverIndex,
        setDndOverIndex,
        hiddenColumns,
        activeTaskId
    } = props;

    return (
        tasks.map(task => (
            <TaskRow
                key={task.id}
                data={task}
                dndIdx={{dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex}}
                hiddenColumns={hiddenColumns}
                isActive={parseInt(activeTaskId) === parseInt(task.id)} />
        ))
    );
};

TaskRows.propTypes = {
    tasks: PropTypes.array,
    dndIndex: PropTypes.number,
    sedDndIndex: PropTypes.func,
    dndOverIndex: PropTypes.number,
    setDndOverIndex: PropTypes.func,
    hiddenColumns: PropTypes.array,
    activeTaskId: PropTypes.number || null,
};

const mapStateToProps = state => ({
    activeTaskId: state.task.activeTaskId
});

export default connect(mapStateToProps, null)(TaskRows);
