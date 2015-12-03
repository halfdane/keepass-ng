import KeepassWalker from './keepass_walker';

export default class KeepassIoBridge {

    constructor(keepassio, dbpath, password) {
        this.kpio = keepassio;

        this.dbpath = dbpath;
        this.password = password;

        this._loadDatabase = new Promise((resolve, reject) => {
            if (!!this.walker) {
                resolve(this.walker);
            }

            var db = new this.kpio.Database();
            db.addCredential(new this.kpio.Credentials.Password(this.password));
            // db.addCredential(new this.kpio.Credentials.Keyfile('apoc.key'));
            db.loadFile(this.dbpath, (err) => {
                if (err) {
                    reject(err);
                }

                this.walker = new KeepassWalker(db.getRawApi().get().KeePassFile);
                resolve(this.walker);
            });
        });
    }

    getDatabaseGroups(callback) {
        this._loadDatabase
                .then(walker => callback(walker.database.Root.Group));
    }

    getGroupEntries(groupId, callback) {
        this._loadDatabase
                .then(walker => callback(walker.entriesInGroup.get(groupId)));
    }

    getPassword(entryId, callback) {
        callback('I don\'t get the passwords yet :P');
    }

    matchEntries(dbpath, password, userinput, callback) {
        callback('nothing here');
    }
}