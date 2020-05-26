import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';

const TaskItemVirtual = forwardRef((props, ref) => {
    let {data: { id, idx, date, time, description, actions}, visible } = props;

    const tempRowElement = (
        <table ref={ref} style={{display: visible ? 'table' : 'none'}}>
            <tbody>
                <tr>
                    <td>{id}</td>
                    <td>{idx}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>{description}</td>
                    <td>{actions}</td>
                </tr>
            </tbody>
        </table>
    );

    return (createPortal(tempRowElement, document.body));
});

export default TaskItemVirtual;
