import React from 'react';

export const timeFormatter = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    var formattedMinutes = ('0' + minutes).slice(-2);
    let seconds = totalSeconds % 60;
    var formattedSeconds = ('0' + seconds).slice(-2);

    return (<span>{hours}:{formattedMinutes}:{formattedSeconds}</span>);
};
