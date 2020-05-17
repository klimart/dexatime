import React, { useState, useRef } from 'react';
import InputEditable from './cell/InputEditable';

const TaskItem = (props) => {
    let {data: {id, idx, date, time, description, actions}} = props;
    const [descriptionText, setDescriptionText] = useState(description);

    return (
        <tr draggable='true'>
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

export default TaskItem;
