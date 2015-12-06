import electron from 'electron';
import log from 'loglevel';

import remember from './native/settings/settings';

import Mainview from './main_view';
import KeepassBridge from './keepass/keepass_io_bridge';

//TODO: import
const keepassIo = require('keepass.io');
const AppMenu = require('./native/menu.js');

require('./sprites_css.js');

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

    const keepassBridge = new KeepassBridge(keepassIoPromise, remember.timeout);
    new Mainview(electron.clipboard, keepassBridge);
});


