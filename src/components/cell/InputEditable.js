import React, { useState, useRef } from 'react';
import Editable from './Editable';

const InputEditable = (props) => {
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
            type='input'
            setInputWidth={setInputWidth}
        >
            <input
                ref={inputRef}
                type='text'
                name={name}
                className=''
                placeholder={currectContent}
                value={currectContent}
                onChange={e => setCurrectContent(e.target.value)}
                onBlur={e => setContent(currectContent)}
                style={{maxWidth: inputWidth, width: '100%'}}
            />
        </Editable>
    );
};

export default InputEditable;
