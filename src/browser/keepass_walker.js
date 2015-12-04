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

    function stringAttributeToMap(stringAtt) {
        function onlyUnprotected({Value: value}) {
            return !(value && value.$ && value.$.Protected && value.$.Protected === 'True');
        }

        function objectToTuple({Key: key, Value: value}) {
            return [key, value];
        }

        if (!!stringAtt) {
            return new Map(
                    stringAtt
                            .filter(onlyUnprotected)
                            .map(objectToTuple));
        }
    }

    function valuesOf(elementOrArray) {
        if (!!elementOrArray) {
            return (!!elementOrArray.values ? elementOrArray : [elementOrArray]).values();
        }
        return [];
    }

    function* sanitizeEntries(givenDatabase) {
        let database = (JSON.parse(JSON.stringify(givenDatabase)));
        for (let entry of valuesOf(database.Entry)) {
            entry.String = stringAttributeToMap(entry.String);
            yield {groupId: database.UUID, entry: entry};
        }

        for (let root of valuesOf(database.Root)) {
            yield* sanitizeEntries(root);
        }

        for (let group of valuesOf(database.Group)) {
            yield* sanitizeEntries(group);
        }
    }

    return new Promise((resolve, reject) => {
        let entriesToGroupId = new Map();
        for (let {groupId: groupId, entry: entry} of sanitizeEntries(database.KeePassFile)) {
            if (!entriesToGroupId.has(groupId)) {
                entriesToGroupId.set(groupId, []);
            }
            entriesToGroupId.get(groupId).push(entry);
        }
        resolve({database: database, entriesToGroupId: entriesToGroupId});
    });
}
