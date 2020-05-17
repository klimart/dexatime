import React, { useState, useRef } from 'react';
import Editable from './Editable';

const InputEditable = (props) => {
    const inputRef = useRef();
    const [inputWidth, setInputWidth] = useState('');

    let {content = '...', setContent, name = ''} = props;

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
                placeholder={content}
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{maxWidth: inputWidth, width: '100%'}}
            />
        </Editable>
    );
};

export default InputEditable;
