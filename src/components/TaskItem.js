import React, { useState, useRef, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import InputEditable from './cell/InputEditable';
import { changeTaskOrder } from '../actions/task';
import task from '../reducers/task';

const TaskItem = (props) => {
    let {data, dndIdx = {}, changeTaskOrder, sort} = props;
    let {id, idx, date, time, description, actions} = data;
    let {dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex} = dndIdx;

    const [didMount, setDidMount] = useState(false);
    const [descriptionText, setDescriptionText] = useState(description);
    const [isDragged, setIsDragged] = useState(false);
    const [isDraggable, setIsDraggable] = useState(true);
    const [dndClassName, setDndClassName] = useState('');

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
        if (parseInt(idx) !== parseInt(dndOverIndex)) {
            setDndClassName(null);
            return;
        }

        let dragOverClass;
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

        setDndClassName(dragOverClass);

    }, [dndOverIndex]);

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
        if (!didMount) {
            setDidMount(true);

            return;
        }

    }, [descriptionText]);

    return (
        <tr ref={rowRef}
            className={dndClassName}
            draggable={isDraggable}
            onDragStart={startDrag}
            onDragEnd={endDrag}
            onDragOver={dragOver}>
            <td>{id}</td>
            <td>{idx}</td>
            <td><Moment date={date} format="DD-MM-YYYY"/></td>
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
    changeTaskOrder: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    sort: state.task.sort
});

export default connect(mapStateToProps, { changeTaskOrder })(TaskItem);
