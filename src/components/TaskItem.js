import React, { useState, useRef, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classNames from 'classnames';
import InputEditable from './cell/InputEditable';
import { changeTaskOrder, setActiveTask, updateTask } from '../actions/task';
// import task from '../reducers/task';

/**
 * Task item - grid row
 */
const TaskItem = (props) => {
    let {
        activeTaskId,
        setActiveTask,
        data,
        dndIdx = {},
        changeTaskOrder,
        sort,
        updateTask
    } = props;
    let {id, idx, date, time, description, actions} = data;
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
            onClick={e => {setActiveTask(id)}}>
            <td>{id}</td>
            <td>{idx}</td>
            <td><Moment date={date} format="DD/MM/YY"/></td>
            <td>{time}</td>
            <td>
                <InputEditable
                    content={descriptionText}
                    setContent={setDescriptionText}
                />
            </td>
            <td>{actions}</td>
        </tr>
    );
};

TaskItem.propTypes = {
    activeTaskId: PropTypes.number || null,
    changeTaskOrder: PropTypes.func.isRequired,
    setActiveTask: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    updateTask: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    activeTaskId: state.task.activeTaskId,
    sort: state.task.sort
});

export default connect(
    mapStateToProps,
    {
        changeTaskOrder,
        setActiveTask,
        updateTask
    }
)(TaskItem);
