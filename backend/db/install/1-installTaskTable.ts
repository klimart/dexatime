import { IImportScript } from '../types';
import Database from 'better-sqlite3';
import Config from 'config';

class InstallTaskTable implements IImportScript {
    private taskTableName = Config.get('taskTable.name');

    constructor(private connection: Database.Database) {}

    public getVersion = () => 2;

    public getName = () => 'Install Task Table';

    public execute = () => {
        this.installTaskTable();
    };

    private installTaskTable = () => {
        let query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
        let stmt = this.connection.prepare(query);
        let tableExists = stmt.get(this.taskTableName);

        if (!tableExists) {
            // Create Task table
            let createTableQuery = `CREATE TABLE ${this.taskTableName} (
                id INTEGER PRIMARY KEY,
                idx INTEGER,
                date TEXT,
                time INTEGER,
                description TEXT
            )`;

            let statement = this.connection.prepare(createTableQuery);
            statement.run();
        }
    };
}

export default InstallTaskTable;
