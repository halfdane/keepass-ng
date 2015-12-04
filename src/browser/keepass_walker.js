import 'babel-polyfill';

function valuesOf(elementOrArray) {
    if (!!elementOrArray) {
        return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
    }
    return [];
}

function* collectEntries(db) {
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

export function sanitizeDb(database, LOG = () => {
}) {
    return new Promise((resolve, reject) => {
        try {
            let entriesToGroupId = new Map();
            let copy = (JSON.parse(JSON.stringify(database.KeePassFile || database)));

            for (let {groupId: groupId, entry: entry} of collectEntries(copy)) {

                if (!!entry.String) {
                    entry.String = new Map(
                            entry.String.filter(onlyUnprotected)
                                    .map(objectToTuple));
                    LOG(entry.UUID, typeof entry.String.get);
                }

                if (!entriesToGroupId.has(groupId)) {
                    entriesToGroupId.set(groupId, []);
                }
                entriesToGroupId.get(groupId).push(entry);
            }
            resolve({database: copy, entriesToGroupId: entriesToGroupId});
        } catch (err) {
            reject(err);
        }
    });
}

export function getString(uuid, fieldname, LOG = ()=> {
}) {
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