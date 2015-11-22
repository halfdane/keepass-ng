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

function registerShortcuts() {
    "use strict";
    if (BrowserWindow.getFocusedWindow()) {
        globalShortcut.register('ctrl+c', function () {
            mainWindow.webContents.send('copy-password-of-active-entry');
        });
        globalShortcut.register('ctrl+b', function () {
            mainWindow.webContents.send('copy-username-of-active-entry');
        });
    }
}

function unregisterShortcuts() {
    "use strict";
    if (!BrowserWindow.getFocusedWindow()) {
        globalShortcut.unregister('ctrl+c');
    }
}

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1024, height: 768});
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.on ('blur', function () {
        setImmediate(unregisterShortcuts);
    }.bind(this));

    mainWindow.on ('focus', function () {
        setImmediate(registerShortcuts);
    }.bind(this));

    registerShortcuts();

});
app.on('will-quit', function () {
    globalShortcut.unregister('ctrl+c');
    globalShortcut.unregisterAll();
});

