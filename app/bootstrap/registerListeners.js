const { ipcMain } = require('electron');
const Task = require('../model/task');
const logger = require('../model/logger');

const registerListeners = (mainWindow) => {
    const {
        addNewTask,
        changeTasksOrder,
        deleteTask,
        getTasksList,
        getTasksListCount,
        getPartTasksList,
        startTaskById,
        stopTaskById,
        updateTask
    } = Task();

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

    ipcMain.on('task:part-list:load', (event, {offset, limit}) => {
        let tasksList = getPartTasksList(offset, limit);
        logger.info('loadPartTaskList', tasksList);
        mainWindow.webContents.send('task:part-list:loaded', tasksList);
    });

    ipcMain.on('task:list:count', () => {
        let tasksCount = getTasksListCount();
        logger.info('tasksCount', tasksCount);
        mainWindow.webContents.send('task:list:counted', tasksCount);
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
        mainWindow.webContents.send('task:started', startResult);
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
};

module.exports = registerListeners;
