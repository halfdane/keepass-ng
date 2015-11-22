const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

electron.crashReporter.start();

var mainWindow = null;

var shortcuts_for_focused_window = {
    'ctrl+c': 'copy-password-of-active-entry',
    'ctrl+b': 'copy-username-of-active-entry'
};

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function create_ipc_sender(signal) {
    "use strict";
    return function () {
        mainWindow.webContents.send(signal);
    }
}

function registerShortcuts() {
    "use strict";
    if (BrowserWindow.getFocusedWindow()) {
        for (var shortcut in shortcuts_for_focused_window) {
            if (shortcuts_for_focused_window.hasOwnProperty(shortcut)) {
                globalShortcut.register(shortcut, create_ipc_sender(shortcuts_for_focused_window[shortcut]));
            }
        }
    }
}

function unregisterShortcuts() {
    "use strict";
    if (!BrowserWindow.getFocusedWindow()) {
        for (var shortcut in shortcuts_for_focused_window) {
            if (shortcuts_for_focused_window.hasOwnProperty(shortcut)) {
                globalShortcut.unregister(shortcut);
            }
        }
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

    globalShortcut.register('Command+a', function () {
        console.log("even works with super!");
    });

});
app.on('will-quit', function () {

    for (var shortcut in shortcuts_for_focused_window) {
        if (shortcuts_for_focused_window.hasOwnProperty(shortcut)) {
            globalShortcut.unregister(shortcut);
        }
    }
    globalShortcut.unregister('Command+a');
    globalShortcut.unregisterAll();
});

