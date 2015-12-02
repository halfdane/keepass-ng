export default class KeepassIoBridge {
    constructor(keepassio, dbpath, password) {
        this.kpio = keepassio;
        this.dbpath = dbpath;
        this.password = password;
    }

    _loadDatabase(loaded) {
        var db = new this.kpio.Database();
        db.addCredential(new this.kpio.Credentials.Password(this.password));
        // db.addCredential(new this.kpio.Credentials.Keyfile('apoc.key'));
        db.loadFile(this.dbpath, function (err) {
            if (err) {
                throw err;
            }

            loaded(db.getBasicApi());
        });
    }

    _getEntryValue(expectedString, entry) {
        var value = entry.String
                .filter(object => object.Key === expectedString)
                .pop();
        if (!!value) {
            return value.Value;
        }
    }

    _convertEntry(entry) {
        return {
            title: this._getEntryValue('Title', entry),
            username: this._getEntryValue('UserName', entry),
            password: '*****',
            url: this._getEntryValue('URL', entry),
            notes: this._getEntryValue('Notes', entry),
            uuid: entry.UUID,
            icon: entry.IconID,
            tags: entry.Tags
        };
    }

    getDatabaseGroups(callback) {
        this._loadDatabase((basicApi) => {
            var groups = basicApi.getGroupTree();
            callback(groups);
        });
    }

    getGroupEntries(groupId, callback) {
        this._loadDatabase((basicApi) => {
            var entries = basicApi.getEntries(groupId);
            callback(entries.map(this._convertEntry, this));
        });
    }

    getPassword(entryId, callback) {
        this._loadDatabase((db) => {
            //var rawApi = db.getRawApi();

            callback('I don\'t get the passwords yet :P');
        });
    }

    matchEntries(dbpath, password, userinput, callback) {
        callback('nothing here');
    }
}