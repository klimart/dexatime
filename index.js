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
    console.log('newTask', newTask);
    mainWindow.webContents.send('task:added', newTask);
});

ipcMain.on('task:delete', (event, taskId) => {
    let result = deleteTask(taskId);
    console.log('Delete Task', taskId);
    mainWindow.webContents.send('task:deleted', result ? true : false);
});

ipcMain.on('task:list:load', () => {
    let tasksList = getTasksList();
    console.log('loadTaskList', tasksList);
    mainWindow.webContents.send('task:list:loaded', tasksList);
});

ipcMain.on('task:start', (event, taskId) => {
    console.log('task start', taskId);
    let startResult = startTaskById(taskId);
    console.log('task started', startResult);
    mainWindow.webContents.send('task:started', startResult ? true : false);
});

ipcMain.on('task:stop', (event, taskId) => {
    console.log('task stop', taskId);
    let stopResult = stopTaskById(taskId);
    mainWindow.webContents.send('task:stopped', stopResult ? true : false);
});

ipcMain.on('task:update', (event, taskData) => {
    console.log('Update task data', taskData);
    let updateResult = updateTask(taskData);
    console.log('Updated task data', updateResult);
    mainWindow.webContents.send('task:updated', updateResult);
});

ipcMain.on('task:change-order', (event, params) => {
    console.log('Update task Order', params);
    let updateResult = changeTasksOrder(params);
    mainWindow.webContents.send('task:change-order:done', updateResult);
});