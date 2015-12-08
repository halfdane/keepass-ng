import { sanitizeDb, getString, matches, entryWith } from './keepass_walker';
import log from 'loglevel';

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

    findMatches(searchString, max) {
        log.debug(`Searching for maximum ${max} entries that match ${searchString}`);
        return this.kpioPromiseFactory(this.incriminating, matches(searchString, max));
    }

    getEntry(uuid) {
        log.debug(`Searching for entry with uuid ${uuid}`);
        return this.kpioPromiseFactory(this.incriminating, entryWith(uuid));
    }
}