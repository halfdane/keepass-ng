import electron from 'electron';

import Mainview from './main_view';
import KeepassBridge from './keepass_io_bridge';

const keepassIo = require('keepass.io');
const AppMenu = require('./menu.js');

require('./sprites_css.js');

document.addEventListener('DOMContentLoaded', () => {
    new AppMenu();
    const keepassBridge = new KeepassBridge(keepassIo, './example.kdbx', 'password');
    new Mainview(document.getElementById('sidebar'),
            document.getElementById('entries'),
            electron.clipboard,
            keepassBridge
    );

});

