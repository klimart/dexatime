const { app, BrowserWindow } = require('electron');
const createWindow = require('./app/bootstrap/createMainWindow');

app.allowRendererProcessReuse = false;

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
