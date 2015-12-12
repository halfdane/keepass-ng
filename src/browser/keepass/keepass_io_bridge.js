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

        getDatabase(callback) {
            if (!this.db) {
                this.db = this.kpioPromiseFactory(JSON.parse(decrypt(this.waitFor(), this.incriminating)), callback)
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
            return this.getDatabase(this.walker.getDatabase(this.totp))
                    .then(({database: database}) => database.Root.Group);
        }

        getGroupEntries(groupId) {
            log.debug('Trying to access database for entries of group', groupId);
            return this.getDatabase(this.walker.getDatabase(this.totp))
                    .then(({entriesToGroupId: entriesToGroupId}) => entriesToGroupId.get(groupId));
        }

        findMatches(searchString, max) {
            log.debug(`Searching for maximum ${max} entries that match ${searchString}`);
            return this.getDatabase(this.walker.matches(searchString, this.totp, max));
        }

        getEntry(uuid) {
            log.debug(`Searching for entry with uuid ${uuid}`);
            return this.getDatabase(this.walker.entryWith(uuid, this.totp));
        }
    }
})();