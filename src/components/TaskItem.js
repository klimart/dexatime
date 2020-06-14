import React, { useState, useRef, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputEditable from './cell/InputEditable';
import { addTask, changeTaskOrder } from '../actions/task';

const TaskItem = (props) => {
    let {data, dndIdx = {}, addTask, changeTaskOrder} = props;
    let {id, idx, date, time, description, actions} = data;
    let {dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex} = dndIdx;

    const [didMount, setDidMount] = useState(false);
    const [descriptionText, setDescriptionText] = useState(description);
    const [isDragged, setIsDragged] = useState(false);
    const [isDraggable, setIsDraggable] = useState(!!data.description);
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

        switch (true) {
            case parseInt(dndIndex) > parseInt(dndOverIndex):
                setDndClassName('drag-up');
                break;
            case parseInt(dndIndex) < parseInt(dndOverIndex):
                setDndClassName('drag-down');
                break;
            default:
                setDndClassName(null);
                break;
        }

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

        if (descriptionText) {
            if (id) {
                console.log(descriptionText);
            } else {
                addTask({idx, description: descriptionText});
            }
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
            <td>{date}</td>
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
    addTask: PropTypes.func.isRequired,
    changeTaskOrder: PropTypes.func.isRequired
};

export default connect(null, { addTask, changeTaskOrder })(TaskItem);
