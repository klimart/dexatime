import React, { Fragment } from 'react';
import restoreQuotes from '@Client/utils/restoreQuotes';

export default (text) => (
    typeof text === 'string'
    ? restoreQuotes(text).split("\n").map((item, idx) => (
        <Fragment key={idx}>
            {item}
            <br/>
        </Fragment>
    ))
    : text
);
