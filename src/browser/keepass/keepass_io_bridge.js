import log from 'loglevel';
import { sanitizeDb, getString } from './keepass_walker';

export default class KeepassIoBridge {

    constructor(kpioPromiseFactory, timeout) {
        this.kpioPromiseFactory = kpioPromiseFactory;
        this.accessDatabase({});
        this.waitFor = timeout();
    }

    accessDatabase(incriminating) {
        log.debug('Accessing database');
        new Promise(resolve => {
            log.debug('Waiting for', this.waitFor);
            setTimeout(resolve, this.waitFor);
        }).then(()=> {
            log.debug('Clearing data');
            delete this.incriminating;
            this.incriminating = {};
        }).catch(log.error.bind(log));

        this.incriminating = incriminating;
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