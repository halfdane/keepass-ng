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

        * _collectEntries(group, searchableSubgroupsOnly = false) {
            log.debug(`iterating group ${group.UUID}`);
            if (searchableSubgroupsOnly === true && (!group.EnableSearching || group.EnableSearching === 'false')) {
                log.debug(`Aborting search in ${group.UUID}`);
                return;
            }

            log.debug(`iterating entries of ${group.UUID}`);
            for (let entry of this._valuesOf(group.Entry)) {

                if (!!entry.String.map) {
                    entry.String = new Map(
                            entry.String.map(this._protectedToObfuscated())
                                    .map(this._objectToTuple));
                }
                yield {groupId: group.UUID, entry: entry};
            }

            log.debug(`iterating roots of ${group.UUID}`);
            for (let root of this._valuesOf(group.Root)) {
                yield* this._collectEntries(root, searchableSubgroupsOnly);
            }

            log.debug(`iterating contained groups ${group.UUID}`);
            for (let groupItem of this._valuesOf(group.Group)) {
                yield* this._collectEntries(groupItem, searchableSubgroupsOnly);
            }
        }

        getDatabase() {
            return database => {
                log.debug('Handing the database in a promise');
                return new Promise(resolve => {
                    database = database.KeePassFile || database;
                    let entriesToGroupId = new Map();

                    for (let {groupId: groupId, entry: entry} of this._collectEntries(database)) {
                        log.debug(`Group ${groupId} new entry ${entry.UUID}`);
                        if (!entriesToGroupId.has(groupId)) {
                            entriesToGroupId.set(groupId, []);
                        }
                        entriesToGroupId.get(groupId).push(entry);
                    }
                    console.log('Checked the database, ready to move on');
                    resolve({database: database, entriesToGroupId: entriesToGroupId});
                });
            }
        }

        entryWith(uuid) {
            return ({database: database}) => {
                return new Promise((resolve, reject) => {
                    try {
                        for (let {entry: entry} of this._collectEntries(database.KeePassFile || database)) {
                            if (entry.UUID === uuid) {
                                log.debug('Got entry', entry);
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

            return ({database: database}) => {
                log.debug(`Looking for ${searchString}`);
                let matches = [];
                for (let {entry: entry} of this._collectEntries(database.KeePassFile || database, true)) {
                    log.debug(`Checking for match on ${entry.UUID}`);
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