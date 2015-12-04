import { sanitizeDb, getString } from '../browser/keepass_walker';

export default class KeepassIoBridge {

    constructor(keepassio, dbpath, password) {
        this.kpio = keepassio;

        this.dbpath = dbpath;
        this.password = password;

        this._loadDatabase = this._loadAsync(sanitizeDb);
    }

    _loadAsync(withRawDatabase) {
        return new Promise((resolve, reject) => {
            var db = new this.kpio.Database();
            db.addCredential(new this.kpio.Credentials.Password(this.password));
            // db.addCredential(new this.kpio.Credentials.Keyfile('apoc.key'));
            db.loadFile(this.dbpath, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(withRawDatabase(db.getRawApi().get().KeePassFile));
            });
        });
    }

    getDatabaseGroups() {
        return this._loadDatabase
                .then(({database: database}) => database.Root.Group);
    }

    getGroupEntries(groupId) {
        return this._loadDatabase
                .then(({entriesToGroupId: entriesToGroupId}) => entriesToGroupId.get(groupId));
    }

    getPassword(entryId) {
        return this._loadAsync(getString(entryId, 'Password'));
    }

    matchEntries(dbpath, password, userinput, callback) {
        callback('nothing here');
    }
}