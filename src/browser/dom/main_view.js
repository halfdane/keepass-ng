import log from 'loglevel';

const triggerEvent = require('./trigger').triggerEvent;
import GroupTree  from './group_tree';
import EntryList from './entry_list';

import AccessDatabase from './prompts/access_database';

export default class MainView {

    constructor(electronClipboard, keepassBridge,
                groupTree = new GroupTree(),
                entryList = new EntryList()) {

        for (let searchbox of document.getElementsByTagName('halfdane-searchbox')) {
            searchbox.addEventListener('search', (event) => {
                keepassBridge.findMatches(event.detail.term)
                        .then(entries => entryList.show(Array.from(entries)))
                        .catch(this.handleErrors.bind(this));
            });
            searchbox.addEventListener('complete', (event) => {
                let pushTitle = (array, entry) => {
                    if (!!entry) {
                        array.push(entry.String.get('Title'));
                    }
                };
                keepassBridge.findMatches(event.detail.term)
                        .then(entries => {
                            let suggestions = [];
                            pushTitle(suggestions, entries.next().value);
                            pushTitle(suggestions, entries.next().value);
                            pushTitle(suggestions, entries.next().value);
                            pushTitle(suggestions, entries.next().value);
                            event.detail.suggest(suggestions);
                        })
                        .catch(this.handleErrors.bind(this));
            });
        }

        groupTree.on('navigate', uuid => {
            log.debug('Group', uuid);
            keepassBridge.getGroupEntries(uuid)
                    .then(entries => entryList.show(entries))
                    .catch(this.handleErrors.bind(this));
        });

        //groupTree.addEventListener('navigate', uuid => {
        //    log.debug('Group', uuid);
        //    keepassBridge.getGroupEntries(uuid)
        //            .then(entries => entryList.show(entries))
        //            .catch(this.handleErrors.bind(this));
        //});

        entryList.on('navigate', function (uuid) {
            log.debug('Entry', uuid);
        });

        //entryList.addEventListener('navigate', function (uuid) {
        //    log.debug('Entry', uuid);
        //});

        document.addEventListener('reload-database', () => {
            log.debug('Reloading database');
            keepassBridge.getDatabaseGroups()
                    .then(groups => groupTree.show(groups))
                    .catch(this.handleErrors.bind(this));
        });

        document.addEventListener('missing-credentials', () => {
            log.debug('hiding all incriminating information');
            entryList.hide();
            groupTree.hide();
        });

        document.addEventListener('copy-password-of-active-entry', () => {
            var entryId = entryList.getIdOfActiveEntry();
            keepassBridge.getPassword(entryId)
                    .then(password => {
                        if (!!password) {
                            electronClipboard.writeText(password);
                        }
                    })
                    .catch(this.handleErrors.bind(this));
        });

        document.addEventListener('copy-username-of-active-entry', () => {
            var username = entryList.getUsernameOfActiveEntry();
            if (!!username) {
                electronClipboard.writeText(username);
            }
        });

        document.addEventListener('password-for-database-set', event => {
            log.debug('setting password');
            keepassBridge.accessDatabase(event.detail);
            console.log(require('./trigger'));
            triggerEvent('reload-database');
        });

        console.log(require('./trigger'));
        triggerEvent('reload-database');
    }

    handleErrors(err) {
        log.debug('Handling error ', err);
        if (err.name === 'KpioArgumentError') {
            if (err.message === 'Expected `rawPassword` to be a string' ||
                    err.message === 'Expected `filePath` to be a String') {
                this.getFileAndCredentials({});
            }
        } else if (err.name === 'KpioDatabaseError') {
            if (err.message === 'Could not decrypt database. Either the credentials were invalid or the database is corrupt.') {
                this.getFileAndCredentials({password: 'wrongPasswordOrCorruptDatabase'});
            }
        } else if (err.name === 'KpioGenericError') {
            if (err.message.startsWith('Database file does not exist:')) {
                this.getFileAndCredentials({dbfile: 'fileNotFound'});
            } else if (err.message.startsWith('Keyfile does not exist:')) {
                this.getFileAndCredentials({keyfile: 'fileNotFound'});
            }
        } else {
            log.error('COULD NOT HANDLE ', err);
        }
    }

    getFileAndCredentials(errors) {
        new AccessDatabase(errors)
                .then((info) => {
                    if (!!info) {
                        triggerEvent('password-for-database-set', info);
                    } else {
                        triggerEvent('missing-credentials');
                    }
                }).catch(log.error.bind(log));
    }
}