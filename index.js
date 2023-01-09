const logger = require('./app/model/logger');
logger.info('App start');

const electron = require('electron');

// Created DB connection.
const Database = require('better-sqlite3');
const Adapter = require('./app/db/adapter');

const { app, BrowserWindow, Menu } = electron;

app.allowRendererProcessReuse = false;

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

    mainWindow.loadFile(`./src/index.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    const registerListeners = require('./app/model/registerListeners');
    registerListeners(mainWindow);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

const menuTemplate = [];

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
