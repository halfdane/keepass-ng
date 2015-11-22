global.$ = $;

const electron = require('electron');
const app = electron.app;  // Module to control application life.

var remote = require('remote');
var Menu = remote.require('menu');
var shell = require('shell');

var keepass = require('./view/keepass.js')('./');
var group_tree = require('./view/group_tree.js');
var EntryList = require('./view/entry_list.js');

require('./view/sprites_css.js');

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

var showEntriesOfGroup = function (uuid) {
    "use strict";

    keepass.getGroupEntries(databaseName, password, uuid)
            .then(function (entries) {
                var entryList = new EntryList($('#entries'));
                entryList.show(entries);
                entryList.on('navigate', function(uuid){
                    console.log("Navigating to entry", uuid);
                });
            }, function (reason) {
                console.log(reason)
            });
};

$(document).ready(function () {
    initMenu();

    keepass.getDatabaseGroups(databaseName, password)
            .then(function (result) {
                var groupTree = new group_tree.GroupTree($('#sidebar'));
                groupTree.show(result);
                groupTree.on('navigate', showEntriesOfGroup);
            }, function (reason) {
                console.log(reason)
            });

});
