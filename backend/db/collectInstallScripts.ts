import { IImportScript, isImportScript } from './types';
import Database from 'better-sqlite3';

export const collectInstallScripts = (
    connection: Database.Database,
    dbVersion: number
): IImportScript[] => {
    const fs = require('fs');
    const scriptsDir = 'install';

    let scripts: IImportScript[] = [];
    fs.readdirSync(`${__dirname}/${scriptsDir}`)
        .filter((file: string) => {
            return ['.js', '.ts'].indexOf(file.slice(-3)) !== -1;
        })
        .map((file: string) => {
            const filePath = `${__dirname}/${scriptsDir}/${file}`;
            const { default: importScriptClass } = require(filePath);
            const importScript = new importScriptClass(connection);
            if (!isImportScript(importScript)) {
                return;
            }

            const scriptVersion = importScript.getVersion();
            if (scriptVersion > dbVersion) {
                scripts.push(importScript);
            }
        })
        .sort((scriptA: IImportScript, scriptB: IImportScript) => {
            return scriptA.getVersion() < scriptB.getVersion()
                ? -1
                : scriptA.getVersion() === scriptB.getVersion()
                ? 0
                : 1;
        });

    return scripts;
};
