import Adapter from '../db/adapter';
import Config from 'config';
import logger from './logger';
import escapeQuote from '../utils/escapeQuote';

type ChangeTasksOrdersProps = {
    idx1: number,
    idx2: number
}

type TaskData = {
    idx: number,
    description: string,
    time?: number
}

type TaskDataUndefined = {
    idx: undefined,
    description: undefined,
    time: undefined
}

type UpdateTaskProps = {
    id: number,
    params: TaskData
}

type TaskDataType = {
    time?: number,
    start?: number
}

const TaskModel = () => {
    let connection = Adapter.getConnection();
    let taskTableName = Config.get('taskTable.name');

    // Task fields example
    // [
    //     {id: 1, idx: 1, date: '1595538399385', time: 300, description: 'task 1 description', start: '12312342134'},
    //     {id: 2, idx: 2, date: '1595538399385', time: 300, description: 'task 2 description', start: ''},
    //     {id: 3, idx: 3, date: '1595538399385', time: 300, description: 'task 3 description', start: ''}
    // ];

    const getLatestTaskIdx = () => {
        let maxIdxQuery = `SELECT MAX(idx) FROM ${taskTableName}`;
        let maxIdxStmt = connection.prepare(maxIdxQuery);

        return maxIdxStmt.pluck().get();
    };

    const getLastTaskId = () => {
        let maxIdx = getLatestTaskIdx();
        let getTaskQuery = `SELECT * FROM ${taskTableName} WHERE idx=${maxIdx}`;
        let getTaskStmt = connection.prepare(getTaskQuery);
        let task = getTaskStmt.get();

        return task.id;
    };

    let addNewTask = () => {
        // Prepare new task index
        let maxIdx = getLatestTaskIdx();
        logger.info('maxIdx:', maxIdx);
        let newIdx = maxIdx ? maxIdx + 1 : 1;
        let newTime = 0;
        let newDescription = '';

        // New task date
        let newDate = Date.now();

        let addTaskQuery =
            `INSERT INTO ${taskTableName} (idx, date, time, description)
             VALUES ('${newIdx}', '${newDate}', '${newTime}', '${newDescription}')`;
        let newTaskStmt = connection.prepare(addTaskQuery);
        let newTaskInfo = newTaskStmt.run();

        let rowId = newTaskInfo.lastInsertRowid;

        let getNewTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${rowId}`;
        let getNewTaskStmt = connection.prepare(getNewTaskQuery);

        let newTaskData;
        try {
            newTaskData = getNewTaskStmt.get();
        } catch (error: any) {
            newTaskData = {};
        }

        return newTaskData;
    }


    // Exchange tasks orders
    let changeTasksOrder = (params: ChangeTasksOrdersProps) => {
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
        } catch (error: any) {
            logger.error('Get task by id error', error.message);

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
        } catch (error: any) {
            logger.error('Update task index error', error.message);

            updateResult = false;
        }

        return updateResult;
    }

    let deleteTask = (taskId: number) => {
        let deleteTasksQuery = `DELETE FROM ${taskTableName} WHERE id=${taskId}`;
        let deleteTasksStmt = connection.prepare(deleteTasksQuery);

        let result;
        try {
            result = deleteTasksStmt.run();
        } catch (error: any) {
            result = false;
        }

        return result;
    }

    let getTasksList = () => {
        let getTasksQuery = `SELECT * FROM ${taskTableName}`;
        let getTasksStmt = connection.prepare(getTasksQuery);

        let taskList;
        try {
            taskList = getTasksStmt.all();
        } catch (error: any) {
            taskList = [];
        }

        return taskList;
    }

    const getTasksListCount = () => {
        const getTasksCountQuery = `SELECT count(*) as count FROM ${taskTableName}`;
        const getTasksStmt = connection.prepare(getTasksCountQuery);

        let taskCount;
        try {
            taskCount = getTasksStmt.get().count;
        } catch (error: any) {
            logger.error('Get tasks count list error: ', error.message);
            taskCount = null;
        }

        return taskCount;
    }

    const getPartTasksList = (offset: number = 0, limit: number = 30) => {
        let getTasksQuery = `
            SELECT * FROM ${taskTableName}
            ORDER BY idx DESC
            LIMIT ${offset}, ${limit}`;
        let getTasksStmt = connection.prepare(getTasksQuery);

        let taskList: Array<TaskData>;
        try {
            taskList = getTasksStmt.all();
        } catch (error: any) {
            taskList = [];
        }

        return taskList;
    }

    let startTaskById = (taskId: number) => {
        if (!taskId) {
            taskId = getLastTaskId();
        }

        let newDate = Date.now();
        let startTaskQuery =
            `UPDATE ${taskTableName} SET start=${newDate} WHERE id=${taskId}`;
        let startTaskStmt = connection.prepare(startTaskQuery);

        let result;
        try {
            result = startTaskStmt.run();
        } catch (error: any) {
            result = false;
        }

        return result ? taskId : false;
    }

    let stopTaskById = (taskId: number) => {
        let getStopTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getStopTaskStmt = connection.prepare(getStopTaskQuery);

        let stopTaskTime: number;
        try {
            let stopTaskData = getStopTaskStmt.get();
            stopTaskTime = parseInt(stopTaskData.time);
            let startSessionStart = parseInt(stopTaskData.start);

            if (startSessionStart) {
                let currentSessionTime = Math.round(Date.now() - startSessionStart) / 1000;
                currentSessionTime = Math.round(currentSessionTime);
                stopTaskTime = stopTaskTime + currentSessionTime;
            }
        } catch (error: any) {
            logger.error('Stop task query error', error.message)
            stopTaskTime = 0;
        }

        let stopTaskQuery =
            `UPDATE ${taskTableName}
             SET start=NULL, time=${stopTaskTime}
             WHERE id=${taskId}`;
        let stopTaskStmt = connection.prepare(stopTaskQuery);

        let result: Boolean | Object;
        try {
            result = stopTaskStmt.run();
        } catch (error: any) {
            result = false;
        }

        return result;
    }

    let updateTask = (data: UpdateTaskProps) => {
        let taskId = data.id;
        let taskParams = data.params;

        let getTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getTaskStmt = connection.prepare(getTaskQuery);

        let savedTaskData: TaskData | TaskDataUndefined;
        try {
            savedTaskData = getTaskStmt.get();
        } catch (error: any) {
            savedTaskData = {idx: undefined, description: undefined, time: undefined};
        }

        let hasChanges = taskParams.idx && (taskParams.idx !== savedTaskData.idx)
            || Boolean(taskParams.description) && (taskParams.description !== savedTaskData.description)
            || Number.isInteger(taskParams.time) && taskParams.time !== savedTaskData.time;

        if (hasChanges) {
            let taskIdx = taskParams.idx || savedTaskData.idx;
            let taskDescription = Boolean(taskParams.description) ? taskParams.description : savedTaskData.description;
            taskDescription = escapeQuote(taskDescription || '');
            let updateTaskTime = Number.isInteger(taskParams.time) ? taskParams.time : savedTaskData.time;

            let updateTaskQuery =
                `UPDATE ${taskTableName}
                    SET idx=${taskIdx}, description='${taskDescription}', time=${updateTaskTime}
                  WHERE id=${taskId}`;
            logger.info('Update task query', updateTaskQuery);
            let updateTaskStmt = connection.prepare(updateTaskQuery);

            let updateResult: Boolean | Object;
            try {
                updateResult = updateTaskStmt.run();
            } catch (error: any) {
                logger.error('Update task error')
                updateResult = false;
            }
        }

        // Return updated task data with processed time value
        // time = time + (now-start)
        let getUpdatedTaskQuery = `SELECT * FROM ${taskTableName} WHERE rowid=${taskId}`;
        let getUpdatedTaskStmt = connection.prepare(getUpdatedTaskQuery);

        let updatedTaskData: TaskDataType;
        try {
            updatedTaskData = getUpdatedTaskStmt.get();
            let updatedTaskTime = updatedTaskData.time || 0;
            let startTime = updatedTaskData.start;
            if (startTime) {
                let currentSessionTime = Math.round((Date.now() - startTime) / 1000);
                currentSessionTime = Math.round(currentSessionTime);
                updatedTaskData.time = updatedTaskTime + currentSessionTime;
            }
        } catch (error: any) {
            updatedTaskData = {};
        }

        logger.info('Result updatedTaskData', updatedTaskData);
        return updatedTaskData;
    }

    return {
        addNewTask,
        changeTasksOrder,
        deleteTask,
        getTasksList,
        getTasksListCount,
        getPartTasksList,
        startTaskById,
        stopTaskById,
        updateTask
    };
};

export default TaskModel;
