const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

electron.crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1024, height: 768});
    mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    globalShortcut.register('CmdOrCtrl+Alt+M', function() {
        var win = new BrowserWindow({ width: 800, height: 600, frame: true });
        win.webContents.openDevTools();
        win.loadURL('file://' + __dirname + '/search.html');
    });

});

app.on('will-quit', function() {
    // Unregister a shortcut.
    globalShortcut.unregister('CmdOrCtrl+Alt+M');

    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
});