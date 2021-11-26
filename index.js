const logger = require('./app/model/logger');
logger.info('App start');

const electron = require('electron');

// Created DB connection.
const Database = require('better-sqlite3');
const Adapter = require('./app/db/adapter');

const { app, BrowserWindow, Menu } = electron;

app.allowRendererProcessReuse = false;
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        useContentSize: true,
        icon: './icon.png',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    const registerListeners = require('./app/model/registerListeners');
    registerListeners(mainWindow);
});

const menuTemplate = [];
