import electron from 'electron';
import BrowserWindow from 'browser-window';

const app = electron.app;
const application = {};
const globalShortcut = electron.globalShortcut;

var mainWindow = null;

electron.crashReporter.start();

application.createBrowserWindow = (url, windowOptions) => {
    let window = new BrowserWindow(windowOptions);
    window.loadURL(url);
    window.webContents.openDevTools();
    return window;
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = application.createBrowserWindow(
            'file://' + __dirname + '/../browser/index.html',
            {width: 1024, height: 768});
    mainWindow.on('closed', () =>  mainWindow = null);

    globalShortcut.register('Control+Super+J', () => {
        mainWindow.webContents.send('search-and-activate-entry');
    });
    globalShortcut.register('Control+Super+K', () => {
        mainWindow.webContents.send('copy-username-of-active-entry');
    });
    globalShortcut.register('Control+Super+L', () => {
        mainWindow.webContents.send('copy-password-of-active-entry');
    });
});
app.on('will-quit', () => {
    globalShortcut.unregister('Control+Super+K');
    globalShortcut.unregister('Control+Super+L');
    globalShortcut.unregisterAll();
});

export default application;