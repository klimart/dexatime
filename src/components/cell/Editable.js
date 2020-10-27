import React, { useState, useEffect, useRef } from 'react';

const Editable = ({
    text,
    type,
    placeholder,
    children,
    childRef,
    setInputWidth,
    isEditable = true,
    ...props
}) => {
    const [isEditing, setEditing] = useState(false);
    const [editableWidth, setEditableWidth] = useState(0);
    const [editableHeight, setEditableHeight] = useState('auto');
    const editableRef = useRef();

    useEffect(() => {
        if (editableRef.current && editableRef.current.clientWidth) {
            setEditableWidth(editableRef.current.clientWidth);
        }

        if (childRef && childRef.current && isEditing === true) {
            setInputWidth(editableWidth);
            childRef.current.focus();
            childRef.current.select();
        }
    }, [isEditing]);

    const handleKeyDown = (event, type) => {
        const { key } = event;
        const keys = ['Escape', 'Tab'];
        const enterKey = 'Enter';
        const allKeys = [...keys, enterKey];
        if (
            (type === 'textarea' && keys.indexOf(key) > -1) ||
            (type !== 'textarea' && allKeys.indexOf(key) > -1)
        ) {
            childRef.current.blur();
            setEditing(false);
        }
    };

    return (
        isEditing ? (
        <div
            onBlur={() => setEditing(false)}
            onKeyDown={e => handleKeyDown(e, type)}
            style={{
                minHeight: `${editableHeight}px`,
                padding: 0,
                boxSizing: 'border-box',
                height: '100%',
                padding: '0',
                position: 'relative'
            }}>
            {children}
        </div>
        ) : (
        <div
            ref={editableRef}
            className={`editable-${type}`}
            onClick={() => {setEditableHeight(editableRef.current.clientHeight); isEditable && setEditing(true);}}
            style={{padding: '5px'}}>
            <span className={`${text ? 'text-regular' : 'text-placeholder'}`}>
            {text || placeholder || ''}
            </span>
        </div>)
    );
};

export default Editable;
