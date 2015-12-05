import electron from 'electron';
import log from 'loglevel';

import Mainview from './main_view';
import KeepassBridge from './keepass/keepass_io_bridge';

const keepassIo = require('keepass.io');
const AppMenu = require('./menu.js');

require('./sprites_css.js');

document.addEventListener('DOMContentLoaded', () => {
    log.setLevel(log.levels.DEBUG);
    new AppMenu();
    const keepassBridge = new KeepassBridge(keepassIo);
    new Mainview(electron.clipboard, keepassBridge);
});


