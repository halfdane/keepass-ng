const electron = require('electron');

var keepass = require('./keepass.js')('./');
var GroupTree = require('./group_tree.js');
var EntryList = require('./entry_list.js');

var AppMenu = require('./menu.js');

require('./sprites_css.js');

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

document.addEventListener("DOMContentLoaded", function() {

    new AppMenu();

    entryList = new EntryList(document.getElementById('entries'));
    groupTree = new GroupTree(document.getElementById('sidebar'));

    keepass.getDatabaseGroups(databaseName, password)
            .then(function (result) {
                groupTree.show(result);
                groupTree.on('navigate', showEntriesOfGroup);
            }, function (reason) {
                console.log(reason)
            });

    document.addEventListener('copy-password-of-active-entry', function () {
        var password = entryList.getPasswordOfActiveEntry();
        if (!!password) {
            electron.clipboard.writeText(password);
        }
    });
    document.addEventListener('copy-username-of-active-entry', function () {
        var username = entryList.getUsernameOfActiveEntry();
        if (!!username) {
            electron.clipboard.writeText(username);
        }
    });
});

