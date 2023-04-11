export type IImportScript = {
    getVersion: () => number;
    getName: () => string;
    execute: () => void;
};

export const isImportScript = (
    scriptName: IImportScript
): scriptName is IImportScript => {
    return (
        (scriptName as IImportScript).getVersion !== undefined &&
        (scriptName as IImportScript).execute !== undefined
    );
};
