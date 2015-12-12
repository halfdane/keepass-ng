'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const glob = require("glob");
const path = require("path");
const console = require('console');

electron.crashReporter.start();

require("live-server").start({
    port: 8181, // Set the server port. Defaults to 8080.
    open: false, // When false, it won't load your browser by default.
    wait: 100
});

let mainWindow;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
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

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});