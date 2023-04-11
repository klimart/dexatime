import Database from 'better-sqlite3';
import logger from '../model/logger';
import { collectInstallScripts } from './collectInstallScripts';
import { getDbVersion, setDbVersion } from '../model/dbVersion';

const InstallSchema = (connection: Database.Database) => {
    const dbVersion = getDbVersion(connection);
    logger.info(`Db Version:`, dbVersion);

    let installedCount = 0;
    let installedVersion = dbVersion;

    let run = () => {
        const scripts = collectInstallScripts(connection, dbVersion);

        const setUpDbVersion = (version: number) => {
            if (version > dbVersion) {
                setDbVersion(connection, version);
                logger.info(`New DB Version: ${version}`);
            }
        };

        scripts.map((installScript) => {
            try {
                logger.info(`Run script: `, installScript);
                logger.info(`Run script: `, installScript.getName());
                installScript.execute();
                installedVersion = installScript.getVersion();
                installedCount++;
            } catch (err) {
                err instanceof Error
                    ? logger.error(err.message)
                    : logger.error('Error script execute');

                setUpDbVersion(installedVersion);
                throw new Error('Install script error');
            }
        });

        setUpDbVersion(installedVersion);
        logger.info(`Installed ${installedCount} scripts`);
    };

    return { run };
};

export default InstallSchema;
