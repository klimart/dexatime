//https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#new-databasepath-options
import Database from 'better-sqlite3';
import Config from 'config';
import InstallSchema from './install';
import logger from '../model/logger';

class Adapter {
    connection: Database.Database;

    constructor() {
        this.connection = this.initConnection();
        this.checkInstallShema();
    }

    checkInstallShema() {
        let {run} = InstallSchema(this.connection);
        run();
    }

    initConnection() {
        try {
            logger.info('db connect')
            let dbName = Config.get('dbConfig.name');
            if (typeof dbName !== 'string') {
                throw new Error('Missing database name');
            }

            return new Database(dbName, {verbose: console.log});
        } catch (err: any) {
            logger.error(err.message);
            process.exit(1);
        }
    }

    getConnection() {
        if (this.connection) {
            return this.connection;
        }

        this.initConnection();

        return this.connection;
    }
}

const AdapterInstance = new Adapter();

export default AdapterInstance;
