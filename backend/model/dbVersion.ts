import Database from 'better-sqlite3';

export const getDbVersion = (connection: Database.Database): number => {
    const getVersionQuery = `PRAGMA user_version`;
    const getVersionStmt = connection.prepare(getVersionQuery);
    const response = getVersionStmt.get();

    return response.user_version;
};

export const setDbVersion = (
    connection: Database.Database,
    version: number
): Database.RunResult => {
    const setVersionQuery = `PRAGMA user_version = ${version}`;
    const getVersionStmt = connection.prepare(setVersionQuery);
    const response = getVersionStmt.run();

    return response;
};
