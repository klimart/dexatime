import React, { useState, useRef } from 'react';
import Editable from '@Client/components/cell/Editable';

const TextareaEditable = (props) => {
    const emptyContentText = '';
    const inputRef = useRef();
    const [inputWidth, setInputWidth] = useState('');

    let {content = emptyContentText, setContent, name = ''} = props;
    const [currectContent, setCurrectContent] = useState(content);

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
                defaultValue={currectContent}
                onChange={e => setCurrectContent(e.target.value)}
                onBlur={e => setContent(currectContent)}
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
