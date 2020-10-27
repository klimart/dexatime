const fs = require('fs');
const filePath = './log.txt';
const os = require('os');

const writeToFile = (text, data) => {
    fs.open(filePath, 'a', 0777, (e, id) => {
        fs.write( id, text + ': ' + JSON.stringify(data) + os.EOL, null, 'utf8', () => {
            fs.close(id, () => {});
        });
    });
 };

const logger = {
    error: (message, data) => {
        let type = 'error';
        let time = new Date().toLocaleString();
        let messageTitle = `${time}: [${type.toUpperCase()}]: ${message}`;
        // console.log(messageTitle, data);

        writeToFile(messageTitle, data);
    },

    info: (message, data) => {
        let type = 'info';
        let time = new Date().toLocaleString();
        let messageTitle = `${time}: [${type.toUpperCase()}]: ${message}`;
        // console.log(messageTitle, data);

        writeToFile(messageTitle, data);
    }
};

module.exports = logger;
