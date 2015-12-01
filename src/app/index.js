import electron from 'electron';
import BrowserWindow from 'browser-window';

const app = electron.app;

const application = {};

var mainWindow = null;

/*
const globalShortcut = electron.globalShortcut;
var globalShortcutRegister = () => {
    app.on('ready', () => {
        globalShortcut.register('CmdOrCtrl+Alt+M', () => {
            var win = new BrowserWindow({width: 800, height: 600, frame: true});
            win.webContents.openDevTools();
            win.loadURL('file://' + __dirname + '/search.html');
        });
    });

    app.on('will-quit', () => {
        globalShortcut.unregister('CmdOrCtrl+Alt+M');
        globalShortcut.unregisterAll();
    });
};
*/

var createBrowserWindow = (windowOptions) => {
    return new BrowserWindow(windowOptions);
};

electron.crashReporter.start();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

var openWindow = () => {
    mainWindow = application.createBrowserWindow({width: 1024, height: 768});
    mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

app.on('ready', () => {
    application.openWindow();
});

application.createBrowserWindow = createBrowserWindow;
application.openWindow = openWindow;

export default application;