import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classNames from 'classnames';
import InputEditable from './cell/InputEditable';
import { changeTaskOrder, setActiveTask, updateTask } from '../actions/task';
import { timeFormatter } from '../utils/timeFormatter';
import Actions from './cell/Actions';

/**
 * Task item - grid row
 */
const TaskRow = (props) => {
    let {
        activeTaskId,
        inProgress,
        setActiveTask,
        data,
        dndIdx = {},
        changeTaskOrder,
        sort,
        updateTask,
        hiddenColumns
    } = props;
    let {id, idx, date, time, description} = data;
    let {dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex} = dndIdx;

    const [descriptionText, setDescriptionText] = useState(description);
    const [isDragged, setIsDragged] = useState(false);
    const [isDraggable, setIsDraggable] = useState(true);
    const [currenClassName, setCurrentClassName] = useState('');

    const rowRef = useRef();

    const endDrag = (e) => {
        if (parseInt(dndIndex) !== parseInt(dndOverIndex)) {
            changeTaskOrder(dndIndex, dndOverIndex);
        }
        sedDndIndex(null);
        setDndOverIndex(null);
        setIsDragged(false);
    };

    const startDrag = (e) => {
        setIsDragged(true);
        sedDndIndex(idx);
    };

    const dragOver = e => {
        if (setDndOverIndex) {
            setDndOverIndex(idx);
        }
    };

    const getDateFromSeconds = (seconds) => {
        let date = new Date(parseInt(seconds));

        return date.toDateString();
    };

    useEffect(() => {
        let dragOverClass = null;
        if (parseInt(idx) === parseInt(dndOverIndex)) {
            switch (true) {
                case parseInt(dndIndex) > parseInt(dndOverIndex):
                    dragOverClass = sort.direction === 'desc' ? 'drag-down' : 'drag-up';
                    break;
                case parseInt(dndIndex) < parseInt(dndOverIndex):
                    dragOverClass = sort.direction === 'desc' ? 'drag-up' : 'drag-down';
                    break;
                default:
                    dragOverClass = null;
                    break;
            }
        }

        let activeClass = parseInt(activeTaskId) === parseInt(id) ? 'is-active' : '';

        setCurrentClassName(classNames(dragOverClass, activeClass));

    }, [dndOverIndex, activeTaskId]);

    useEffect(() => {
        if (isDragged) {
            rowRef.current.style.opacity = 0;
        } else {
            setTimeout(() => {
                rowRef.current.style.opacity = 1;
            }, 50);
        }
    }, [isDragged]);

    useEffect(() => {
        if (descriptionText === description) {
            return;
        }

        updateTask({
            id,
            params: {
                description: descriptionText
            }
        });

    }, [descriptionText]);

    return (
        <tr ref={rowRef}
            className={currenClassName}
            draggable={isDraggable}
            onDragStart={startDrag}
            onDragEnd={endDrag}
            onDragOver={dragOver}
            onClick={e => setActiveTask(id)}>
            {!hiddenColumns.includes('id') && <td className="column-id">{id}</td>}
            {!hiddenColumns.includes('idx') && <td className="column-idx">{idx}</td>}
            {!hiddenColumns.includes('date')
            && <td className="column-time">
                <Moment date={getDateFromSeconds(date)} format="DD/MM/YY"/>
            </td>}
            {!hiddenColumns.includes('time') && <td className="column-time">{timeFormatter(time)}</td>}
            {!hiddenColumns.includes('description')
            && <td className="column-description">
                <InputEditable
                    content={descriptionText}
                    setContent={setDescriptionText}
                />
            </td>}
            {!hiddenColumns.includes('actions')
            && <td className="column-actions">
                <Actions taskId={id} />
            </td>}
        </tr>
    );
};

TaskRow.propTypes = {
    activeTaskId: PropTypes.number || null,
    changeTaskOrder: PropTypes.func.isRequired,
    setActiveTask: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    updateTask: PropTypes.func.isRequired,
    hiddenColumns: PropTypes.array
};

const mapStateToProps = state => ({
    activeTaskId: state.task.activeTaskId,
    inProgress: state.task.inProgress,
    sort: state.task.sort
});

export default connect(
    mapStateToProps,
    {
        changeTaskOrder,
        setActiveTask,
        updateTask
    }
)(TaskRow);
