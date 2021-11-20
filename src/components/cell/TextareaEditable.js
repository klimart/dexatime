import React, { useState, useRef, useEffect } from 'react';
import Editable from '@Client/components/cell/Editable';

const TextareaEditable = (props) => {
    const emptyContentText = '';
    const inputRef = useRef();
    const [inputWidth, setInputWidth] = useState('');
    const [updateCursorPosition, setUpdateCursorPosition] = useState(null);

    let {content = emptyContentText, setContent, name = ''} = props;
    const [currectContent, setCurrectContent] = useState(content);

    const handleKeyPress = (e) => {
        const enterCode = 13;
        if (e.keyCode === enterCode && e.ctrlKey) {
            processPressCrtlEnter();
        }
    };

    const processPressCrtlEnter = () => {
        const newRowSymbol = "\n";
        let position = getCursorPosition();
        addSymbolToPosition(newRowSymbol, position);
        const newPosition = position + newRowSymbol.length;
        setUpdateCursorPosition(newPosition);
    };

    const getCursorPosition = () => inputRef.current.selectionStart;
    const setCursorPosition = (pos) => {
        inputRef.current.setSelectionRange(pos, pos);
    };

    const addSymbolToPosition = (symbol, position) => {
        let newContent = currectContent.substring(0, position)
            + symbol
            + currectContent.substring(position);
        setCurrectContent(newContent);
    };

    // Control cursor position after press Ctrl+Enter.
    useEffect(() => {
        if (!updateCursorPosition) {
            return;
        }

        setCursorPosition(updateCursorPosition);
        setUpdateCursorPosition(null);
    }, [currectContent]);

    return (
        <Editable
            text={content}
            placeholder={content}
            childRef={inputRef}
            type='textarea'
            setInputWidth={setInputWidth}>
            <textarea
                ref={inputRef}
                name={name}
                className=""
                placeholder={currectContent}
                value={currectContent}
                onChange={e => setCurrectContent(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={e => setContent(currectContent.trim())}
                style={{
                    maxWidth: inputWidth,
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    fontSize: '20px',
                    position: 'absolute'
                }}
            ></textarea>
        </Editable>
    );
};

export default TextareaEditable;
