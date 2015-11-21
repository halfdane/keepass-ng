global.$ = $;

const electron = require('electron');
const app = electron.app;  // Module to control application life.

var remote = require('remote');
var Menu = remote.require('menu');
var shell = require('shell');

var keepass = require('./view/keepass.js')('./');
var group_tree = require('./view/group_tree.js');
var entry_view = require('./view/entry_view.js');

var password = 'password';
var databaseName = 'example.kdbx';

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

var showEntriesOfGroup = function (entryList) {
    "use strict";
    return function (event) {
        keepass.getGroupEntries(databaseName, password, event.uuid)
                .then(function (entries) {
                    entryList.show(entries);
                }, function (reason) {
                    console.log(reason)
                });
    };
};

$(document).ready(function () {
    initMenu();

    keepass.getDatabaseGroups(databaseName, password)
            .then(function (result) {
                var groupTree = new group_tree.GroupTree($('#sidebar'));
                groupTree.show(result);

                var entries = new entry_view.EntryList($('#files'));
                groupTree.on('navigate', showEntriesOfGroup(entries));
            }, function (reason) {
                console.log(reason)
            });

});
