import electron from 'electron';
import log from 'loglevel';

import remember from './native/settings/settings';

import Mainview from './main_view';
import KeepassBridge from './keepass/keepass_io_bridge';

//TODO: import
const keepassIo = require('keepass.io');
const AppMenu = require('./native/menu.js');

require('./sprites_css.js');

document.addEventListener('DOMContentLoaded', () => {
    //TODO: make configurable
    log.setLevel(log.levels.DEBUG);
    new AppMenu();

    window.global.remember = remember;

    //TODO: create promise or function that can be easily mocked instead of keepassIo
    const keepassBridge = new KeepassBridge(keepassIo);
    new Mainview(electron.clipboard, keepassBridge);
});


