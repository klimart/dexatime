import React, { useState, useRef, Fragment, useEffect } from 'react';
import InputEditable from './cell/InputEditable';
import TaskItemVirtual from './TaskItemVirtual';

const TaskItem = (props) => {
    let {data, mouse, dndIdx = {}} = props;
    let {id, idx, date, time, description, actions} = data;
    let {mousePosition, setMousePosition} = mouse;
    let {dndIndex, sedDndIndex, dndOverIndex, setDndOverIndex} = dndIdx;

    const [descriptionText, setDescriptionText] = useState(description);
    const [showDndRow, setShowDndRow] = useState(false);
    const [isDragged, setIsDragged] = useState(false);
    const [isDraggable, setIsDraggable] = useState(!!data.description);
    const [dragOffsetY, setDragOffsetY] = useState(0);
    const [dndClassName, setDndClassName] = useState('');

    const rowRef = useRef();
    const dndRowRef = useRef();

    const dndRow = (
        <TaskItemVirtual ref={dndRowRef} data={data} visible={showDndRow}/>
    );

    const endDrag = (e) => {
        sedDndIndex(null);
        setDndOverIndex(null);
        setDragOffsetY(0);
        rowRef.current.style.opacity = 1;
        setShowDndRow(false);
        setIsDragged(false);
    };

    const startDrag = (e) => {
        setIsDragged(true);
        sedDndIndex(idx);
        setDragOffsetY(e.target.offsetHeight);
        rowRef.current.style.opacity = 0;
        setMousePosition({x: e.clientX, y: e.clientY})
        setShowDndRow(true);
    };

    const dragOver = e => {
        if (setDndOverIndex) {
            setDndOverIndex(idx);
        }

        setMousePosition({x: e.clientX, y: e.clientY});
    };

    const row = (
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
            dndRowRef.current.style.top = (mousePosition.y - dragOffsetY/2) + 'px';
        }
    }, [mousePosition]);

    useEffect(() => {
        if (isDragged) {
            dndRowRef.current.style.width = rowRef.current.clientWidth + 'px';
            dndRowRef.current.style.position = 'absolute';
            dndRowRef.current.style.top = (mousePosition.y - dragOffsetY/2) + 'px';
            dndRowRef.current.style.left = 0 + 'px';
            dndRowRef.current.style['z-index'] = -1;
        }
    }, [isDragged]);

    return (<Fragment>{row}{isDragged && dndRow}</Fragment>);
};

export default TaskItem;
