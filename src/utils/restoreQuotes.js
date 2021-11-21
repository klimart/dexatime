export default (text) => (
    text.replace(/\\x27/g, '\'').replace(/\\x22/g, '\"')
);
