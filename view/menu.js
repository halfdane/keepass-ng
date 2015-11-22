(function () {
    "use strict";

    var remote = require('remote');
    var Menu = remote.require('menu');
    var shell = require('shell');

    function AppMenu() {
        var menu = new Menu();

        var template = [
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Copy password of active item',
                        accelerator: 'CmdOrCtrl+C',
                        click: function (item, focusedWindow) {
                            const ipcRenderer = require('electron').ipcRenderer;
                            ipcRenderer.send('copy-password-of-active-entry');
                        }
                    },
                    {
                        label: 'Copy username of active item',
                        accelerator: 'CmdOrCtrl+B',
                        click: function (item, focusedWindow) {
                            const ipcRenderer = require('electron').ipcRenderer;
                            ipcRenderer.send('copy-username-of-active-entry');
                        }
                    },
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: function (item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.reload();
                            }
                        }
                    },
                ]
            },
        ];

        if (process.platform == 'darwin') {
            menu.createMacBuiltin && menu.createMacBuiltin("FileExplorer");

            var name = require('electron').app.getName();
            template.unshift({
                label: name,
                submenu: [
                    {
                        label: 'About ' + name,
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Services',
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide ' + name,
                        accelerator: 'Command+H',
                        role: 'hide'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Shift+H',
                        role: 'hideothers'
                    },
                    {
                        label: 'Show All',
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: function () {
                            app.quit();
                        }
                    },
                ]
            });
            // Window menu.
            template[3].submenu.push(
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Bring All to Front',
                        role: 'front'
                    }
            );
        }

        menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    module.exports = AppMenu;
}());