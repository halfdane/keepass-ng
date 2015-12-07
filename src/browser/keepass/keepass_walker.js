import log from 'loglevel';

function valuesOf(elementOrArray) {
    if (!!elementOrArray) {
        return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
    }
    return [];
}

function* collectEntries(db, onlyIfSearchingEnabled = false) {
    if (onlyIfSearchingEnabled && !!db.EnableSearching && db.EnableSearching === 'false') {
        return;
    }

    for (let entry of valuesOf(db.Entry)) {
        yield {groupId: db.UUID, entry: entry};
    }

    for (let root of valuesOf(db.Root)) {
        yield* collectEntries(root);
    }

    for (let group of valuesOf(db.Group)) {
        yield* collectEntries(group);
    }
}

function onlyKey(expectedKey) {
    return ({Key: key}) => !!key && key === expectedKey;
}

function protectedValue({Value: value}) {
    if (!!value && !!value._) {
        return value._;
    }
}

function onlyUnprotected({Value: value}) {
    return !(!!value && !!value.$ && !!value.$.Protected && value.$.Protected === 'True');
}

function objectToTuple({Key: key, Value: value}) {
    return [key, value];
}

export function sanitizeDb(database) {
    log.debug(database);
    return new Promise((resolve, reject) => {
        try {
            database = database.KeePassFile || database;
            let entriesToGroupId = new Map();

            for (let {groupId: groupId, entry: entry} of collectEntries(database)) {

                if (!!entry.String) {
                    entry.String = new Map(
                            entry.String.filter(onlyUnprotected)
                                    .map(objectToTuple));
                    log.debug(entry.UUID, typeof entry.String.get);
                }

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

export function getString(uuid, fieldname) {
    return database => {
        return new Promise((resolve, reject) => {
            try {
                for (let {entry: entry} of collectEntries(database.KeePassFile || database)) {
                    if (entry.UUID === uuid) {
                        resolve(protectedValue(
                                entry.String.find(onlyKey(fieldname))));
                    }
                }
                reject(new Error(`Could not find entry ${uuid}`));
            } catch (err) {
                reject(err);
            }
        });
    };
}

export function matches(searchString) {
    return function*(database) {
        const regExp = new RegExp(`.*${searchString}.*`, 'i');
        for (let {entry: entry} of collectEntries(database.KeePassFile || database, true)) {
            if (!!entry.String) {
                log.debug(entry.String);
                const unprotectedStrings = entry.String.filter(onlyUnprotected);
                let strings =
                        unprotectedStrings
                                .filter(({Key: key, Value: value}) => regExp.test(key) || regExp.test(value));

                const entryMatches =
                                strings.length > 0
                                || regExp.test(entry.Tags)
                                || regExp.test(entry.Tags)
                        ;
                if (entryMatches) {
                    entry.String = new Map(
                            unprotectedStrings
                                    .map(objectToTuple));

                    log.debug('Found matching entry: ', entry);
                    yield entry;
                }
            }

        }
    }
}