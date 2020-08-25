const Config = require('config');

const InstallShema = (connection) => {
    let taskTableName = Config.get('taskTable.name');

    let run = () => {
        installTaskTable();
        addStartColumn();
    }

    let installTaskTable = () => {
        let query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
        let stmt = connection.prepare(query);
        let tableExists = stmt.get(taskTableName);

        if (!tableExists) {
            // Create Task table
            let createTableQuery =
            `CREATE TABLE ${taskTableName} (
                id INTEGER PRIMARY KEY,
                idx INTEGER,
                date TEXT,
                time INTEGER,
                description TEXT
            )`;

            let statement = connection.prepare(createTableQuery);
            statement.run();
        }
    }

    let addStartColumn = () => {
        let query = `PRAGMA table_info('${taskTableName}')`;
        let stmt = connection.prepare(query);
        let startColumn = 'start';

        for (let row of stmt.iterate()) {
            if (row.name === startColumn) {
                console.log('Start column exists');

                return;
            }
        }

        let addColumnQuery = `ALTER TABLE ${taskTableName} ADD COLUMN ${startColumn} INTEGER`;
        let statement = connection.prepare(addColumnQuery);
        statement.run();
        console.log('Created start column');
    }

    return {run};
};

module.exports = InstallShema;
