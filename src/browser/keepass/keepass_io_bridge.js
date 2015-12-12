(function () {

    const log = require('../logger');
    const Walker = require('./keepass_walker');
    const encrypt = require('./obfuscate').encrypt;
    const decrypt = require('./obfuscate').decrypt;

    module.exports = class KeepassIoBridge {
        constructor(kpioPromiseFactory, waitFor) {
            this.kpioPromiseFactory = kpioPromiseFactory;
            this.waitFor = waitFor;
            this.walker = new Walker(waitFor);
            this.accessDatabase({});
        }

        accessDatabase(incriminating) {
            this.incriminating = encrypt(this.waitFor(), JSON.stringify(incriminating));
            delete this.db;
        }

        getDatabase() {
            if (!this.db) {
                this.db = this.kpioPromiseFactory(JSON.parse(decrypt(this.waitFor(), this.incriminating)),
                        this.walker.getDatabase())
                        .catch(error => {
                            if (error.message === 'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt') {
                                let passwordTimeout = new Error();
                                passwordTimeout.name = 'PasswordTimeOut';
                                passwordTimeout.message = 'The password has timed out - provide it again to gain access';
                                throw passwordTimeout;
                            } else {
                                throw error;
                            }
                        });
            }
            return this.db;
        }

        getDatabaseGroups() {
            log.debug('Trying to access database for groups');
            return this.getDatabase()
                    .then(({database: database}) => database.Root.Group);
        }

        getGroupEntries(groupId) {
            log.debug('Trying to access database for entries of group', groupId);
            return this.getDatabase()
                    .then(({entriesToGroupId: entriesToGroupId}) => {
                        log.debug('entriesToGroupId', entriesToGroupId);
                        return entriesToGroupId.get(groupId)
                    });
        }

        findMatches(searchString, max) {
            log.debug(`Searching for maximum ${max} entries that match ${searchString}`);
            return this.getDatabase()
                    .then(this.walker.matches(searchString, max));
        }

        getEntry(uuid) {
            log.debug(`Searching for entry with uuid ${uuid}`);
            return this.getDatabase()
                    .then(this.walker.entryWith(uuid));
        }
    }
})();