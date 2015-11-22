global.$ = $;

const electron = require('electron');

var keepass = require('./view/keepass.js')('./');
var GroupTree = require('./view/group_tree.js');
var EntryList = require('./view/entry_list.js');

var AppMenu = require('./view/menu.js');

require('./view/sprites_css.js');

var password = 'password';
var databaseName = 'example.kdbx';

var entryList;
var groupTree;

var showEntriesOfGroup = function (uuid) {
    "use strict";

    console.log("Navigating to group", uuid);

    keepass.getGroupEntries(databaseName, password, uuid)
            .then(function (entries) {
                entryList.show(entries);
                entryList.on('navigate', function (uuid) {
                    console.log("Navigating to entry", uuid);
                });
            }, function (reason) {
                console.log(reason)
            });
};

$(document).ready(function () {
    new AppMenu();

    entryList = new EntryList($('#entries'));
    groupTree = new GroupTree($('#sidebar'));

    keepass.getDatabaseGroups(databaseName, password)
            .then(function (result) {
                groupTree.show(result);
                groupTree.on('navigate', showEntriesOfGroup);
            }, function (reason) {
                console.log(reason)
            });

    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('copy-password-of-active-entry', function () {
        electron.clipboard.writeText(entryList.getPasswordOfActiveEntry());
    });
    ipcRenderer.on('copy-username-of-active-entry', function () {
        electron.clipboard.writeText(entryList.getUsernameOfActiveEntry());
    });
});
