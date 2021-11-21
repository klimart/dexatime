const escapeQuote = (text) => (
    text.replace(/'/g, '\\x27').replace(/"/g, '\\x22')
);

module.exports = escapeQuote;
