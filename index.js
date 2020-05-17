const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.allowRendererProcessReuse = false;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    //Menu.setApplicationMenu(mainMenu);
});

const menuTemplate = [];
