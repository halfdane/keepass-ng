import log from 'loglevel';
import { sanitizeDb, getString } from './keepass_walker';

function remember() {
    return window.global.remember;
}
export default class KeepassIoBridge {

    constructor(keepassio) {
        this.kpio = keepassio;
    }

    accessDatabase(password, file) {
        log.debug('Accessing database with', password, file);
        new Promise((resolve, reject) => {
            setTimeout(resolve, remember().timeout());
        }).then(()=> {
            log.debug('Clearing');
            delete this.password;
            delete this.dbpath;
            delete this.dbPromise;
        });

        this.password = password;
        this.dbpath = file;
        delete this.dbPromise;
    }

    _loadAsync(withRawDatabase) {
        return new Promise((resolve, reject) => {
            try {
                let db = new this.kpio.Database();
                let dbpath = this.dbpath;

                log.debug('adding credential ', this.password);
                db.addCredential(new this.kpio.Credentials.Password(this.password));
                log.debug('loading file ', dbpath);
                // db.addCredential(new this.kpio.Credentials.Keyfile('apoc.key'));
                db.loadFile(dbpath, (err) => {
                    if (err) {
                        log.debug('Sending the error onward', err);
                        reject(err);
                    }
                    resolve(withRawDatabase(db.getRawApi().get().KeePassFile));

                    remember().lastAccessedFile(dbpath);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    getDatabase() {
        if (!this.dbPromise) {
            this.dbPromise = this._loadAsync(sanitizeDb);
        }
        return this.dbPromise;
    }

    getDatabaseGroups() {
        log.debug('Trying to access database for groups');
        return this.getDatabase()
                .then(({database: database}) => database.Root.Group);
    }

    getGroupEntries(groupId) {
        log.debug('Trying to access database for entries of group', groupId);
        return this.getDatabase()
                .then(({entriesToGroupId: entriesToGroupId}) => entriesToGroupId.get(groupId));
    }

    getPassword(entryId) {
        log.debug('Trying to access database password of entry', entryId);
        return this._loadAsync(getString(entryId, 'Password'));
    }
}