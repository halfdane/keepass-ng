import electron from 'electron';
import log from 'loglevel';

import remember from './settings';
import AppMenu from './menu.js';

import KeepassBridge from './keepass/keepass_io_bridge';
import Mainview from './dom/main_view';

import keepassIo from 'keepass.io';

const ipcRenderer = electron.ipcRenderer;
require('./dom/sprites_css.js');

const keepassIoPromise = function ({dbfile: dbfile, password: password, keyfile: keyfile}, afterLoaded) {
    return new Promise((resolve, reject) => {
        try {
            let db = new keepassIo.Database();
            if (!!password) {
                db.addCredential(new keepassIo.Credentials.Password(password));
            }
            if (!!keyfile) {
                db.addCredential(new keepassIo.Credentials.Keyfile(keyfile));
            }
            log.debug('loading file ', dbfile);
            db.loadFile(dbfile, (err) => {
                if (err) {
                    log.debug('Sending the error onward', err);
                    reject(err);
                }
                resolve(afterLoaded(db.getRawApi().get().KeePassFile));

                remember.lastAccessedFile(dbfile);
            });
        } catch (err) {
            reject(err);
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    //TODO: make configurable
    log.setLevel(log.levels.DEBUG);
    new AppMenu();

    window.global.remember = remember;

    ipcRenderer.on('search-and-activate-entry', function() {
        document.dispatchEvent(new CustomEvent('search-and-activate-entry'));
    });

    ipcRenderer.on('copy-username-of-active-entry', function() {
        document.dispatchEvent(new CustomEvent('copy-username-of-active-entry'));
    });

    ipcRenderer.on('copy-password-of-active-entry', function() {
        document.dispatchEvent(new CustomEvent('copy-password-of-active-entry'));
    });

    const keepassBridge = new KeepassBridge(keepassIoPromise, remember.timeout);
    new Mainview(electron.clipboard, keepassBridge, remember.timeout);
});


