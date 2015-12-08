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
    globalShortcut.register('Control+Super+X', () => {
        console.log('Got global username request');
    });
    globalShortcut.register('Control+Super+C', () => {
        console.log('Got global password request');
    });
});
app.on('will-quit', () => {
    globalShortcut.unregister('Control+Super+X');
    globalShortcut.unregister('Control+Super+C');
    globalShortcut.unregisterAll();
});

export default application;