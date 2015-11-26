const electron = require('electron');

var keepass_bridger = require('./keepass_io_bridge.js');
var GroupTree = require('./group_tree.js');
var EntryList = require('./entry_list.js');

var AppMenu = require('./menu.js');

require('./sprites_css.js');

var password = 'password';
var databaseName = './example.kdbx';

var entryList;
var groupTree;

var showEntriesOfGroup = function (uuid) {
    "use strict";

    console.log("Navigating to group", uuid);

    keepass_bridger.getGroupEntries(databaseName, password, uuid,
            function (entries) {
                entryList.show(entries);
                entryList.on('navigate', function (uuid) {
                    console.log("Navigating to entry", uuid);
                });
            });
};

document.addEventListener("DOMContentLoaded", function () {

    new AppMenu();

    entryList = new EntryList(document.getElementById('entries'));
    groupTree = new GroupTree(document.getElementById('sidebar'));

    keepass_bridger.getDatabaseGroups(databaseName, password,
            function (result) {
                groupTree.show(result);
                groupTree.on('navigate', showEntriesOfGroup);
            });

    document.addEventListener('copy-password-of-active-entry', function () {
        var entryId = entryList.getIdOfActiveEntry();
        keepass_bridger.getPassword(databaseName, password, entryId,
                function (password) {
                    if (!!password) {
                        electron.clipboard.writeText(password);
                    }
                });
    });
    document.addEventListener('copy-username-of-active-entry', function () {
        var username = entryList.getUsernameOfActiveEntry();
        if (!!username) {
            electron.clipboard.writeText(username);
        }
    });
});
