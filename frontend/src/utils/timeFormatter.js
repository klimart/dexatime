export const timeFormatter = (totalSeconds) => {
    totalSeconds = totalSeconds !== undefined ? totalSeconds : 0;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    var formattedMinutes = ('0' + minutes).slice(-2);
    let seconds = totalSeconds % 60;
    var formattedSeconds = ('0' + seconds).slice(-2);

    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

export const convertTimeToSeconds = (formattedTime) => {
    let [hours, minutes, seconds] = formattedTime.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    seconds = parseInt(seconds);

    return hours * 3600 + minutes * 60 + seconds;
};
