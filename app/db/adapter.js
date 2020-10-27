//https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#new-databasepath-options

const Database = require('better-sqlite3');
const Config = require('config');
const InstallSchema = require('./install');
const logger = require('../model/logger');

class Adapter {
    connection;

    constructor() {
        this.initConnection();
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
            this.connection = new Database(dbName, {verbose: console.log});
        } catch (err) {
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
module.exports = AdapterInstance;
