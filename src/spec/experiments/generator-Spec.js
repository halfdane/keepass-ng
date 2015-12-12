function* collectEntries(currentGroup) {
    if (!!currentGroup.entries) {
        for (let entry of currentGroup.entries) {
            yield {groupid: currentGroup.id, entry: entry};
        }
    }

    if (!!currentGroup.groups) {
        for (let group of currentGroup.groups) {
            yield* collectEntries(group);
        }
    }
}

describe('Generator', () => {
    const groups = {
        id: 'group_0',
        groups: [
            {id: 'group_1_1', entries: [{id: 'entry_1_1_1'}, {id: 'entry_1_1_2'}]},
            {
                id: 'group_1_2', entries: [{id: 'entry_1_2_1'}, {id: 'entry_1_2_2'}],
                groups: [
                    {id: 'group_2_1', entries: [{id: 'entry_2_1_1'}, {id: 'entry_2_2'}]}
                ]
            },
            {id: 'group_1_3', entries: [{id: 'entry_1_3_1'}]}
        ],
        entries: [{id: 'entry_0_1'}, {id: 'entry_0_2'}, {id: 'entry_0_3'}, {id: 'entry_0_4'}]
    };

    it('runs through the tree', () => {
        for (let {groupid: groupid, entry: entry} of collectEntries(groups)) {
            log.debug(`groupid: ${groupid} entry: ${entry.id}`)
        }
    });
});