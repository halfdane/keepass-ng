(function () {
    var remote = require('remote');
    var Menu = remote.require('menu');
    const electron = require('electron');

    function AppMenu() {
        var menu = new Menu();

        var template = [
            {
                label: 'Edit',
                submenu: [
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

        if (process.platform === 'darwin') {
            if (menu.createMacBuiltin) {
                menu.createMacBuiltin('FileExplorer');
            }

            var name = electron.app.getName();
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
                            electron.app.quit();
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