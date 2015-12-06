import log from 'loglevel';
import { sanitizeDb, getString } from './keepass_walker';

function remember() {
    return window.global.remember;
}
export default class KeepassIoBridge {

    constructor(kpioPromiseFactory) {
        this.kpioPromiseFactory = kpioPromiseFactory;
        this.accessDatabase({});
    }

    accessDatabase(info) {
        log.debug('Accessing database with');
        new Promise(resolve => {
            setTimeout(resolve, remember().timeout());
        }).then(()=> {
            log.debug('Clearing');
            delete this.incriminating;
            this.incriminating = {};
        });

        this.incriminating = info;
    }

    getDatabase() {
        if (!this.incriminating.dbPromise) {
            this.incriminating.dbPromise = this.kpioPromiseFactory(this.incriminating, sanitizeDb);
        }
        return this.incriminating.dbPromise;
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
        return this.kpioPromiseFactory(this.incriminating, getString(entryId, 'Password'));
    }
}