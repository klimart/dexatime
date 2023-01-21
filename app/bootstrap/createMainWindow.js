const { BrowserWindow, Menu } = require('electron');
const registerListeners = require('./registerListeners');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        useContentSize: true,
        icon: './icon.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    })

    const rootFile = process.env.MODE === 'develop'
        ? `./src/index-dev.html`
        : `./src/index.html`;
    mainWindow.loadFile(rootFile);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    registerListeners(mainWindow);
}

const menuTemplate = [];

module.exports = createWindow;
