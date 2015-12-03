import GroupTree  from './group_tree.js';
import EntryList from './entry_list.js';

export default class MainView {

    constructor(electronClipboard, keepassBridge, groupTree = new GroupTree(), entryList = new EntryList()) {
        groupTree.on('navigate', uuid => {
            console.log('Group', uuid);
            keepassBridge.getGroupEntries(uuid, entries => entryList.show(entries));
        });

        entryList.on('navigate', function (uuid) {
            console.log('Entry', uuid);
        });

        keepassBridge.getDatabaseGroups(groups => groupTree.show(groups));

        document.addEventListener('copy-password-of-active-entry', () => {
            var entryId = entryList.getIdOfActiveEntry();
            keepassBridge.getPassword(entryId,
                    password => {
                        if (!!password) {
                            electronClipboard.writeText(password);
                        }
                    });
        });

        document.addEventListener('copy-username-of-active-entry', () => {
            var username = entryList.getUsernameOfActiveEntry();
            if (!!username) {
                electronClipboard.writeText(username);
            }
        });
    }
}