const logger = require('./app/model/logger');
logger.info('App start');

const electron = require('electron');

// Created DB connection.
const Database = require('better-sqlite3');
const Adapter = require('./app/db/adapter');
const Task = require('./app/model/task');

const { app, BrowserWindow, Menu, ipcMain } = electron;
const {
    addNewTask,
    changeTasksOrder,
    deleteTask,
    getTasksList,
    startTaskById,
    stopTaskById,
    updateTask
} = Task();

let mainWindow;

app.allowRendererProcessReuse = false;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
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
    //Menu.setApplicationMenu(mainMenu);
});

const menuTemplate = [];

ipcMain.on('task:new', () => {
    let newTask = addNewTask();
    logger.info('newTask', newTask);
    mainWindow.webContents.send('task:added', newTask);
});

ipcMain.on('task:delete', (event, taskId) => {
    let result = deleteTask(taskId);
    logger.info('Delete Task', taskId);
    mainWindow.webContents.send('task:deleted', !!result);
});

ipcMain.on('task:list:load', () => {
    let tasksList = getTasksList();
    logger.info('loadTaskList', tasksList);
    mainWindow.webContents.send('task:list:loaded', tasksList);
});

ipcMain.on('task:start', (event, taskId) => {
    logger.info('task start', taskId);
    let startResult = startTaskById(taskId);
    logger.info('task started', startResult);
    mainWindow.webContents.send('task:started', !!startResult);
});

ipcMain.on('task:stop', (event, taskId) => {
    logger.info('task stop', taskId);
    let stopResult = stopTaskById(taskId);
    mainWindow.webContents.send('task:stopped', !!stopResult);
});

ipcMain.on('task:update', (event, taskData) => {
    logger.info('Update task data', taskData);
    let updateResult = updateTask(taskData);
    logger.info('Updated task data', updateResult);
    mainWindow.webContents.send('task:updated', updateResult);
});

ipcMain.on('task:change-order', (event, params) => {
    logger.info('Update task Order', params);
    let updateResult = changeTasksOrder(params);
    mainWindow.webContents.send('task:change-order:done', updateResult);
});