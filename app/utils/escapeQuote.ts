const escapeQuote = (text: string): string => (
    text.replace(/'/g, '\\x27').replace(/"/g, '\\x22')
);

export default escapeQuote;
