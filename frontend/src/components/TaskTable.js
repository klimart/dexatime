import React, { useState, useEffect, Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskRows from '@Client/components/TaskRows';
import { selectLastTask, loadTasksPartList } from '@Client/actions/task';

const TaskTable = (props) => {
    const {
        activeTaskId,
        tasks,
        selectLastTask,
        totalTasksCount,
        loadTasksPartList,
        tasksLoading
    } = props;
    const [dndIndex, sedDndIndex] = useState(null);
    const [dndOverIndex, setDndOverIndex] = useState(null);
    const [lazyLoadTasks, setLazyLoadTasks] = useState(false);
    const [lazyLoadedOffsets, setLazyLoadedOffsets] = useState([]);

    const hiddenColumns = ['idx', 'id'];
    const tableRef = useRef(null);

    const getTasksCount = () => tasks.length;

    useEffect(() => {
        if (!activeTaskId) {
            selectLastTask();
        }
    }, [activeTaskId]);

    useEffect(() => {
        const tableEl = tableRef.current;
        const tableHeight = tableEl.offsetHeight;
        const windowHeight = window.innerHeight;
        const needTasksLoad = getTasksCount() < totalTasksCount;
        if (!needTasksLoad) {
            return;
        }

        const handleWindowScroll = () => {
            //offsetTop + offsetHeight = window.scrollY + window.innerHeight
            let tableToTop = tableEl.offsetTop;
            let windowScroll = window.scrollY;

            let tableBottom = tableToTop + tableHeight;
            const screensToPreloadData = 3;
            // Start tasks loading 1 window prior to scroll to bottom left.
            let scrollReachingTableEnd = tableBottom - windowScroll < screensToPreloadData * windowHeight;

            if (scrollReachingTableEnd && !tasksLoading) {
                setLazyLoadTasks(true);
            }
        };

        window.addEventListener('scroll', handleWindowScroll);

        return () => window.removeEventListener('scroll', handleWindowScroll);
    }, [tasks, totalTasksCount, tasksLoading]);

    useEffect(() => {
        setLazyLoadTasks(false);
        if (!lazyLoadTasks || tasksLoading) {
            return;
        }

        let tasksCount = getTasksCount();
        if (lazyLoadedOffsets.includes(tasksCount)) {
            return;
        }

        loadTasksPartList(tasksCount);
        setLazyLoadedOffsets(offsets => [...offsets, tasksCount]);
    }, [lazyLoadTasks]);

    return (
        <Fragment>
            <table className="tasks-list" ref={tableRef}>
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
            {tasksLoading && <div><span>Loading...</span></div>}
        </Fragment>
    );
};

TaskTable.propTypes = {
    activeTaskId: PropTypes.number,
    tasks: PropTypes.array.isRequired,
    selectLastTask: PropTypes.func.isRequired,
    loadTasksPartList: PropTypes.func.isRequired,
    totalTasksCount: PropTypes.number.isRequired,
    tasksLoading: PropTypes.bool
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

    }),
    totalTasksCount: state.task.totalTasksCount,
    tasksLoading: state.task.tasksLoading
});

export default connect(
    mapStateToProps,
    {selectLastTask, loadTasksPartList}
)(TaskTable);
