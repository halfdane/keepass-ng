export default class KeepassTransformer {

    constructor(database) {
        this.entriesInGroup = new Map();
        this.database = this._transformGroups(database);
    }

    _transformGroups(groups = []) {
        if (!!groups.map) {
            return groups.map(this._transformGroup, this);
        } else {
            return this._transformGroup(groups);
        }
    }

    _transformGroup(group) {
        const convertedGroup = (JSON.parse(JSON.stringify(group)));
        delete convertedGroup.Entry;
        delete convertedGroup.Group;
        delete convertedGroup.Root;

        if (!!group.Entry) {
            convertedGroup.Entry = this._transformEntries(group.UUID, group.Entry);
        }
        if (!!group.Group) {
            convertedGroup.Group = this._transformGroups(group.Group);
        }
        if (!!group.Root) {
            convertedGroup.Root = this._transformGroups(group.Root);
        }
        return convertedGroup;
    }

    _transformEntries(groupId, entries = []) {
        if (!!entries.map) {
            return entries.map(this._transformEntry(groupId), this);
        } else {
            return this._transformEntry(groupId)(entries);
        }
    }

    _transformEntry(groupId) {
        return (entry = {}) => {
            if (!!entry) {
                const convertedEntry = (JSON.parse(JSON.stringify(entry)));
                convertedEntry.String = this._convertStringAttribute(entry.String);
                if (!!groupId) {
                    if (!this.entriesInGroup.has(groupId)) {
                        this.entriesInGroup.set(groupId, []);
                    }
                    this.entriesInGroup.get(groupId).push(convertedEntry);
                }
                return convertedEntry;
            }
        };
    }

    _convertStringAttribute(stringAtt) {
        if (!!stringAtt) {
            const preResult = stringAtt
                    .filter(({Value: value}) =>  KeepassTransformer._isReadable(value))
                    .map(({Key: key, Value: value}) => [key, value]);
            return new Map(preResult);
        }
    }

    static _isReadable(value) {
        return !(value && value.$ && value.$.Protected && value.$.Protected === 'True');
    }
}

export function sanitizeDb(database) {

    function onlyUnprotected({Value: value}) {
        return !(!!value && !!value.$ && !!value.$.Protected && value.$.Protected === 'True');
    }

    function objectToTuple({Key: key, Value: value}) {
        return [key, value];
    }

    function valuesOf(elementOrArray) {
        if (!!elementOrArray) {
            return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
        }
        return [];
    }

    function* sanitizeEntries(db) {
        for (let entry of valuesOf(db.Entry)) {
            if (!!entry.String) {
                entry.String = new Map(
                        entry.String.filter(onlyUnprotected)
                                .map(objectToTuple));
            }
            yield {groupId: db.UUID, entry: entry};
        }

        for (let root of valuesOf(db.Root)) {
            yield* sanitizeEntries(root);
        }

        for (let group of valuesOf(db.Group)) {
            yield* sanitizeEntries(group);
        }
    }

    return new Promise((resolve, reject) => {
        let entriesToGroupId = new Map();
        let copy = (JSON.parse(JSON.stringify(database.KeePassFile)));

        for (let {groupId: groupId, entry: entry} of sanitizeEntries(copy)) {
            if (!entriesToGroupId.has(groupId)) {
                entriesToGroupId.set(groupId, []);
            }
            entriesToGroupId.get(groupId).push(entry);
        }
        resolve({database: copy, entriesToGroupId: entriesToGroupId});
    });
}
