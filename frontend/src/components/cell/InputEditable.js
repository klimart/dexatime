import React, { useState, useRef } from 'react';
import Editable from '@Client/components/cell/Editable';

const InputEditable = (props) => {
    const emptyContentText = '';
    const inputRef = useRef();
    const [inputWidth, setInputWidth] = useState('');


    let {content = emptyContentText, setContent, name = ''} = props;
    const [currentContent, setCurrentContent] = useState(content);

    return (
        <Editable
            text={content}
            placeholder={content}
            childRef={inputRef}
            type='input'
            setInputWidth={setInputWidth}>
            <input
                ref={inputRef}
                type='text'
                name={name}
                className=''
                placeholder={currentContent}
                value={currentContent}
                onChange={e => setCurrentContent(e.target.value)}
                onBlur={e => setContent(currentContent)}
                style={{
                    maxWidth: inputWidth,
                    width: '100%',
                    position: 'absolute',
                    top: '10px',
                    display: 'block',
                    boxSizing: 'border-box',
                    marginTop: '5px'
                }}
            />
        </Editable>
    );
};

export default InputEditable;
