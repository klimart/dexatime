export default (text) => {
    console.log('text: ', text);
    return text
        ? text.replace(/\\x27/g, '\'').replace(/\\x22/g, '\"')
        : ''
};
