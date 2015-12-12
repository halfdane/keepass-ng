(function () {

    const log = require('../logger');
    const encrypt = require('./obfuscate').encrypt;

    module.exports = class KeepassWalker {
        constructor(waitFor) {
            this.waitFor = waitFor;
        }

        _valuesOf(elementOrArray) {
            if (!!elementOrArray) {
                return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
            }
            return [];
        }

        _protectedToObfuscated() {
            return ({Key: key, Value: value}) => {
                if (value && value.$ && value.$.Protected && value.$.Protected === 'True') {
                    value._ = encrypt(this.waitFor(), value._);
                }
                return {Key: key, Value: value};
            }
        }

        _objectToTuple({Key: key, Value: value}) {
            return [key, value];
        }

        * _collectEntries(db, onlyIfSearchingEnabled = false) {
            if (onlyIfSearchingEnabled && !!db.EnableSearching && db.EnableSearching === 'false') {
                return;
            }

            for (let entry of this._valuesOf(db.Entry)) {
                if (!!entry.String.map) {
                    entry.String = new Map(
                            entry.String.map(this._protectedToObfuscated())
                                    .map(this._objectToTuple));
                }
                yield {groupId: db.UUID, entry: entry};
            }

            for (let root of this._valuesOf(db.Root)) {
                yield* this._collectEntries(root, onlyIfSearchingEnabled);
            }

            for (let group of this._valuesOf(db.Group)) {
                yield* this._collectEntries(group, onlyIfSearchingEnabled);
            }
        }

        getDatabase() {
            return database => {
                return new Promise((resolve, reject) => {
                    try {
                        database = database.KeePassFile || database;
                        let entriesToGroupId = new Map();

                        for (let {groupId: groupId, entry: entry} of this._collectEntries(database)) {
                            if (!entriesToGroupId.has(groupId)) {
                                entriesToGroupId.set(groupId, []);
                            }
                            entriesToGroupId.get(groupId).push(entry);
                        }
                        resolve({database: database, entriesToGroupId: entriesToGroupId});
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        }

        entryWith(uuid) {
            return database => {
                return new Promise((resolve, reject) => {
                    try {
                        for (let {entry: entry} of this._collectEntries(database.KeePassFile || database)) {
                            if (entry.UUID === uuid) {
                                resolve(entry);
                            }
                        }
                        reject(new Error(`Could not find entry ${uuid}`));
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        }

        matches(searchString, max) {
            const regExp = new RegExp(`.*${searchString}.*`, 'i');

            function matchesKeyOrValue([key, value]) {
                return regExp.test(key) || regExp.test(value.toString())
            }

            return (database) => {
                let matches = [];
                for (let {entry: entry} of this._collectEntries(database.KeePassFile || database, true)) {
                    let strings = [...entry.String].filter(matchesKeyOrValue);
                    if (strings.length > 0 || regExp.test(entry.Tags)) {
                        log.debug('Found matching entry: ', entry);
                        matches.push(entry);
                        if (!!max && matches.length >= max) {
                            break;
                        }
                    }
                }
                return matches;
            }
        };
    };
})();