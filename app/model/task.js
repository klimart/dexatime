const Adapter = require('../db/adapter');
const Config = require('config');

const TaskModel = () => {
    let connection = Adapter.getConnection();
    let taskTableName = Config.get('taskTable.name');

    // Task fields example
    // [
    //     {id: 1, idx: 1, date: '1595538399385', time: 300, description: 'task 1 description', start: '12312342134'},
    //     {id: 2, idx: 2, date: '1595538399385', time: 300, description: 'task 2 description', start: ''},
    //     {id: 3, idx: 3, date: '1595538399385', time: 300, description: 'task 3 description', start: ''}
    // ];

    let addNewTask = () => {
        // Prepare new task index
        let maxIdxQuery = `SELECT MAX(idx) FROM ${taskTableName}`;
        let maxIdxStmt = connection.prepare(maxIdxQuery);
        let maxIdx = maxIdxStmt.pluck().get();
        console.log('maxIdx:', maxIdx);
        let newIdx = maxIdx ? maxIdx + 1 : 1;
        let newTime = 0;
        let newDescription = '';

        // New task date
        let newDate = Date.now();

        let addTaskQuery =
            `INSERT INTO ${taskTableName} (idx , date, time, description)
             VALUES ('${newIdx}', '${newDate}', '${newTime}', '${newDescription}')`;
        let newTaskStmt = connection.prepare(addTaskQuery);
        let newTaskInfo = newTaskStmt.run();

        let rowId = newTaskInfo.lastInsertRowid;

        let getNewTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${rowId}`;
        let getNewTaskStmt = connection.prepare(getNewTaskQuery);

        let newTaskData;
        try {
            newTaskData = getNewTaskStmt.get();
        } catch (error) {
            newTaskData = {};
        }

        return newTaskData;
    }

    // Exchange tasks orders
    let changeTasksOrder = (params) => {
        let idx1 = params.idx1;
        let idx2 = params.idx2;

        let getTask1Query = `SELECT * FROM ${taskTableName} WHERE idx=${idx1}`;
        let getTask1Stmt = connection.prepare(getTask1Query);

        let getTask2Query = `SELECT * FROM ${taskTableName} WHERE idx=${idx2}`;
        let getTask2Stmt = connection.prepare(getTask2Query);

        let task1Id,
            task2Id;

        try {
            let task1 = getTask1Stmt.get();
            let task2 = getTask2Stmt.get();

            task1Id = task1.id;
            task2Id = task2.id;
        } catch (error) {
            console.log('Get task by id error', error);

            return false;
        }

        if (!task1Id || !task2Id) {
            return false;
        }

        let updateTask1Query = `UPDATE ${taskTableName} SET idx=${idx2} WHERE id=${task1Id}`;
        let updateTask1Stmt = connection.prepare(updateTask1Query);

        let updateTask2Query = `UPDATE ${taskTableName} SET idx=${idx1} WHERE id=${task2Id}`;
        let updateTask2Stmt = connection.prepare(updateTask2Query);

        let updateResult = true;
        try {
            updateTask1Stmt.run();
            updateTask2Stmt.run();
        } catch (error) {
            console.log('Update task index error', error);

            updateResult = false;
        }

        return updateResult;
    }

    let getTasksList = () => {
        let getTasksQuery = `SELECT * FROM ${taskTableName}`;
        let getTasksStmt = connection.prepare(getTasksQuery);

        let taskList;
        try {
            taskList = getTasksStmt.all();
        } catch (error) {
            taskList = [];
        }

        return taskList;
    }

    let startTaskById = (taskId) => {
        let newDate = Date.now();
        let startTaskQuery =
            `UPDATE ${taskTableName} SET start=${newDate} WHERE id=${taskId}`;
        let startTaskStmt = connection.prepare(startTaskQuery);

        let result;
        try {
            result = startTaskStmt.run();
        } catch (error) {
            result = false;
        }

        return result;
    }

    let stopTaskById = (taskId) => {
        let getStopTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getStopTaskStmt = connection.prepare(getStopTaskQuery);

        let stopTaskTime;
        try {
            let stopTaskData = getStopTaskStmt.get();
            stopTaskTime = parseInt(stopTaskData.time);
            let startSessionStart = parseInt(stopTaskData.start);

            if (startSessionStart) {
                let currentSessionTime = (parseInt(Date.now()) - startSessionStart) / 1000;
                currentSessionTime = Math.round(currentSessionTime);
                stopTaskTime = stopTaskTime + currentSessionTime;
            }
        } catch (error) {
            console.log('Stop task query error', error);
            stopTaskTime = 0;
        }

        let stopTaskQuery =
            `UPDATE ${taskTableName}
             SET start=NULL, time=${stopTaskTime}
             WHERE id=${taskId}`;
        let stopTaskStmt = connection.prepare(stopTaskQuery);

        let result;
        try {
            result = stopTaskStmt.run();
        } catch (error) {
            result = false;
        }

        return result;
    }

    let updateTask = (data) => {
        let taskId = data.id;
        let taskParams = data.params;

        let getTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getTaskStmt = connection.prepare(getTaskQuery);

        let savedTaskData;
        try {
            savedTaskData = getTaskStmt.get();
        } catch (error) {
            savedTaskData = {};
        }

        let hasChanges = taskParams.idx && (taskParams.idx !== savedTaskData.idx)
            || taskParams.description && (taskParams.description !== savedTaskData.description);

        if (hasChanges) {
            let taskIdx = taskParams.idx || savedTaskData.idx;
            let taskDescription = taskParams.description || savedTaskData.description;

            let updateTaskQuery =
                `UPDATE ${taskTableName}
                    SET idx=${taskIdx}, description='${taskDescription}'
                WHERE id=${taskId}`;
            console.log('Update task query', updateTaskQuery);
            let updateTaskStmt = connection.prepare(updateTaskQuery);

            let updateResult;
            try {
                updateResult = updateTaskStmt.run();
            } catch (error) {
                console.error('Update task error');
                updateResult = false;
            }
        }

        // Return updated task data with processed time value
        // time = time + (now-start)
        let getUpdatedTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getUpdatedTaskStmt = connection.prepare(getUpdatedTaskQuery);

        let updatedTaskData;
        try {
            updatedTaskData = getUpdatedTaskStmt.get();
            let updatedTaskTime = updatedTaskData.time;
            let startTime = updatedTaskData.start;
            if (startTime) {
                let currentSessionTime = parseInt((Date.now() - startTime) / 1000);
                currentSessionTime = Math.round(currentSessionTime);
                updatedTaskData.time = updatedTaskTime + currentSessionTime;
            }
        } catch (error) {
            updatedTaskData = {};
        }

        console.log('Result updatedTaskData', updatedTaskData);
        return updatedTaskData;
    }

    return {
        addNewTask,
        changeTasksOrder,
        getTasksList,
        startTaskById,
        stopTaskById,
        updateTask
    };
};

module.exports = TaskModel;
