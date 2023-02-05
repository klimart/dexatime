import React, { Fragment } from 'react';
import restoreQuotes from '@Client/utils/restoreQuotes';

export default (text: string) => (
    typeof text === 'string'
    ? restoreQuotes(text).split("\n").map((item: string, idx: number) => (
        <Fragment key={idx}>
            {item}
            <br/>
        </Fragment>
    ))
    : text
);
