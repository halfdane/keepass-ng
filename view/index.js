global.$ = $;

const electron = require('electron');
const app = electron.app;  // Module to control application life.

var remote = require('remote');
var Menu = remote.require('menu');
var shell = require('shell');

var keepass = require('./view/keepass.js')('./');
var group_tree = require('./view/group_tree.js');
var entry_view = require('./view/entry_view.js');

// append default actions to menu for OSX
var initMenu = function () {
    try {
        var nativeMenuBar = new Menu();
        if (process.platform == "darwin") {
            nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("FileExplorer");
        }
    } catch (error) {
        console.error(error);
        setTimeout(function () {
            throw error
        }, 1);
    }
};

$(document).ready(function () {
    initMenu();

    var groups = new group_tree.Groups($('#sidebar'));
    var entries = new entry_view.Entry($('#files'));

    var password = 'password';
    var databaseName = 'example.kdbx';
    keepass.getDatabaseGroups(databaseName, password)
            .then(function (result) {
                groups.show(result[0].Groups);
            }, function (reason) {
                console.log(reason)
            });

    groups.on('navigate', function (uuid) {
        console.log('Navigating to ', uuid);

        keepass.getGroupEntries(databaseName, password, uuid)
                .then(function (entryList) {
                    entries.show(entryList);
                }, function (reason) {
                    console.log(reason)
                });
    });
});
