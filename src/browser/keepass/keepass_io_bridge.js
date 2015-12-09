(function () {

    const log = require('loglevel');

    const walker = require('./keepass_walker');
    const sanitizeDb = walker.sanitizeDb;
    const getString = walker.getString;
    const matches = walker.matches;
    const entryWith = walker.entryWith;

    const encrypt = require('./obfuscate').encrypt;
    const decrypt = require('./obfuscate').decrypt;
    const generateTotp = require('./obfuscate').generateTotp;

    module.exports = class KeepassIoBridge {
        constructor(kpioPromiseFactory, waitFor) {
            this.kpioPromiseFactory = kpioPromiseFactory;
            this.totp = generateTotp(waitFor());
            this.accessDatabase({});
        }

        accessDatabase(incriminating) {
            this.incriminating = encrypt(this.totp, JSON.stringify(incriminating));
            delete this.db;
        }

        getDatabase(callback) {
            if (!this.db) {
                this.db = this.kpioPromiseFactory(JSON.parse(decrypt(this.totp, this.incriminating)), callback)
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
            return this.getDatabase(sanitizeDb(this.totp))
                    .then(({database: database}) => database.Root.Group);
        }

        getGroupEntries(groupId) {
            log.debug('Trying to access database for entries of group', groupId);
            return this.getDatabase(sanitizeDb(this.totp))
                    .then(({entriesToGroupId: entriesToGroupId}) => entriesToGroupId.get(groupId));
        }

        getPassword(entryId) {
            log.debug('Trying to access database password of entry', entryId);
            return this.getDatabase(getString(entryId, 'Password', this.totp))
        }

        findMatches(searchString, max) {
            log.debug(`Searching for maximum ${max} entries that match ${searchString}`);
            return this.getDatabase(matches(searchString, this.totp, max));
        }

        getEntry(uuid) {
            log.debug(`Searching for entry with uuid ${uuid}`);
            return this.getDatabase(entryWith(uuid, this.totp));
        }
    }
})();