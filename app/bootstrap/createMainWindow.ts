import { BrowserWindow } from 'electron';
import registerListeners from './registerListeners';

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        useContentSize: true,
        icon: './icon.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    })

    const rootFile = process.env.MODE === 'develop'
        ? `./src/index-dev.html`
        : `./src/index.html`;
    mainWindow.loadFile(rootFile);

    // const mainMenu = Menu.buildFromTemplate(menuTemplate);

    registerListeners(mainWindow);
}

// const menuTemplate = [];

export default createWindow;
