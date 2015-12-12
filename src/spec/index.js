'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const glob = require('glob');
const path = require('path');
const ipc = electron.ipcMain;

electron.crashReporter.start();

let watching = false;
process.argv.forEach(function (val, index, array) {
    if (val === '-w') {
        watching = true;
    }
});
console.log('Watching: ', watching);

let mainWindow;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-finish-load', function () {

        glob(`${__dirname}/**/*-Spec.js`, function (er, files) {
            if (!er) {
                files = files.map(f => path.resolve(f));
                mainWindow.webContents.send('mocha-run', files);
            }
        });
    });

    if (!watching) {
        ipc.on('mocha-done', function (event, code) {
            process.exit(code);
        });
        ipc.on('mocha-error', function (event, data) {
            writeError(data);
            process.exit(1);
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

function writeError(data) {
    process.stderr.write(`\nError encountered in ${path.relative(process.cwd(), data.filename)}: ${data.message}\n${data.stack}`);
}
