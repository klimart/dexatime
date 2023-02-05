import fs from 'fs';
const filePath = './log.txt';
import os from 'os';
import config from 'config';

const writeToFile = (text: string, data?: any) => {
    fs.open(filePath, 'a', 0o777, (e: any, id: number) => {
        fs.write(id, text + ': ' + JSON.stringify(data) + os.EOL, null, 'utf8', () => {
            fs.close(id, () => {});
        });
    });
};

let allowFileLog = false;
let allowConsoleLog = false;
try {
    allowFileLog = config.has('log') && config.has('log.file') ? Boolean(config.get('log.file')) : false;
    allowConsoleLog = config.has('log') && config.has('log.console') ? Boolean(config.get('log.console')): false;
} catch (Error) {
    console.log(Error);
}

const logger = {
    error: (message: string, data?: any) => {
        let type = 'error';
        let time = new Date().toLocaleString();
        let messageTitle = `${time}: [${type.toUpperCase()}]: ${message}`;
        allowConsoleLog && console.log(messageTitle, data);

        allowFileLog && writeToFile(messageTitle, data);
    },

    info: (message: string, data?: any) => {
        let type = 'info';
        let time = new Date().toLocaleString();
        let messageTitle = `${time}: [${type.toUpperCase()}]: ${message}`;
        allowConsoleLog && console.log(messageTitle, data);

        allowFileLog && writeToFile(messageTitle, data);
    }
};

export default logger;
