(function () {
    const log = require('loglevel');
    const encrypt = require('./obfuscate').encrypt;
    const decrypt = require('./obfuscate').decrypt;

    const walker = {};

    function valuesOf(elementOrArray) {
        if (!!elementOrArray) {
            return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
        }
        return [];
    }

    function protectedToObfuscated(totp) {
        return ({Key: key, Value: value}) => {
            if (value && value.$ && value.$.Protected && value.$.Protected === 'True') {
                value._ = encrypt(totp, value._);
            }
            return {Key: key, Value: value};
        }
    }

    function* collectEntries(db, totp, onlyIfSearchingEnabled = false) {
        if (onlyIfSearchingEnabled && !!db.EnableSearching && db.EnableSearching === 'false') {
            return;
        }

        for (let entry of valuesOf(db.Entry)) {
            if (!!entry.String.map) {
                entry.String = new Map(
                        entry.String.map(protectedToObfuscated(totp))
                                .map(objectToTuple));
            }
            yield {groupId: db.UUID, entry: entry};
        }

        for (let root of valuesOf(db.Root)) {
            yield* collectEntries(root, totp);
        }

        for (let group of valuesOf(db.Group)) {
            yield* collectEntries(group, totp);
        }
    }

    function objectToTuple({Key: key, Value: value}) {
        return [key, value];
    }

    walker.sanitizeDb = function (totp) {
        return database => {
            return new Promise((resolve, reject) => {
                try {
                    database = database.KeePassFile || database;
                    let entriesToGroupId = new Map();

                    for (let {groupId: groupId, entry: entry} of collectEntries(database, totp)) {
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
    };

    walker.getString = function (uuid, fieldname, totp) {
        return database => {
            return walker.entryWith(uuid, totp)(database)
                    .then(entry => {
                        return decrypt(totp, entry.String.get(fieldname)._);
                    })
        }
    };

    walker.entryWith = function (uuid, totp) {
        return database => {
            return new Promise((resolve, reject) => {
                try {
                    for (let {entry: entry} of collectEntries(database.KeePassFile || database, totp)) {
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
    };

    walker.matches = function (searchString, totp, max) {
        return function (database) {
            const regExp = new RegExp(`.*${searchString}.*`, 'i');
            let matches = [];
            for (let {entry: entry} of collectEntries(database.KeePassFile || database, totp, true)) {
                if (!entry.String) {
                    continue;
                }
                let strings = [...entry.String].filter(
                        ([key, value]) =>
                        regExp.test(key) ||
                        regExp.test(value.toString()));

                const entryMatches =
                        strings.length > 0
                        || regExp.test(entry.Tags)
                        || regExp.test(entry.Tags);
                if (entryMatches) {
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

    module.exports = walker;
})();