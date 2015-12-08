import electron from 'electron';
import BrowserWindow from 'browser-window';

const app = electron.app;
const application = {};
const globalShortcut = electron.globalShortcut;

var mainWindow = null;

electron.crashReporter.start();

application.createBrowserWindow = (windowOptions) => {
    return new BrowserWindow(windowOptions);
};

application.openWindow = () => {
    mainWindow = application.createBrowserWindow({width: 1024, height: 768});
    mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    application.openWindow();
    globalShortcut.register('Control+Super+K', () => {
        console.log('Got global username request');
        mainWindow.webContents.send('copy-username-of-active-entry');
    });
    globalShortcut.register('Control+Super+L', () => {
        console.log('Got global password request');
        mainWindow.webContents.send('copy-password-of-active-entry');
    });
});
app.on('will-quit', () => {
    globalShortcut.unregister('Control+Super+K');
    globalShortcut.unregister('Control+Super+L');
    globalShortcut.unregisterAll();
});

export default application;