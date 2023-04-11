import { IImportScript } from '../types';
import Database from 'better-sqlite3';
import Config from 'config';
import logger from '../../model/logger';

class AddStartColumn implements IImportScript {
    private taskTableName = Config.get('taskTable.name');

    constructor(private connection: Database.Database) {}

    public getVersion = () => 2;

    public getName = () => 'Add Start Column';

    public execute = () => {
        this.addStartColumn();
    };

    private addStartColumn = () => {
        let query = `PRAGMA table_info('${this.taskTableName}')`;
        let stmt = this.connection.prepare(query);
        let startColumn = 'start';

        for (let row of stmt.iterate()) {
            if (row.name === startColumn) {
                logger.info('Start column exists');

                return;
            }
        }

        let addColumnQuery = `ALTER TABLE ${this.taskTableName} ADD COLUMN ${startColumn} INTEGER`;
        let statement = this.connection.prepare(addColumnQuery);
        statement.run();
        logger.info('Created start column');
    };
}

export default AddStartColumn;
