(function () {
    var remote = require('remote');
    var Menu = remote.require('menu');
    const electron = require('electron');

    function trigger(event) {
        return function () {
            console.log('Triggering event: ', event);
            document.dispatchEvent(new document.defaultView.CustomEvent(event));
        };
    }

    document.addEventListener('keydown', function (event) {
        var ctrlDown = event.ctrlKey || event.metaKey; // Mac support

        // Check for Alt+Gr (http://en.wikipedia.org/wiki/AltGr_key)
        if (ctrlDown && event.altKey) {

        } else if (ctrlDown && event.keyCode === 67) {
            trigger('copy-password-of-active-entry')();
        } else if (ctrlDown && event.keyCode === 66) {
            trigger('copy-username-of-active-entry')();
        }
    });

    function AppMenu() {
        var menu = new Menu();

        var template = [
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Copy password of active item',
                        accelerator: 'CmdOrCtrl+C',
                        click: trigger('copy-password-of-active-entry')
                    },
                    {
                        label: 'Copy username of active item',
                        accelerator: 'CmdOrCtrl+B',
                        click: trigger('copy-username-of-active-entry')
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