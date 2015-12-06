import log from 'loglevel';
import 'babel-polyfill';

import triggerEvent from './event/trigger';
import GroupTree  from './mainwindow/group_tree';
import EntryList from './mainwindow/entry_list';

import AccessDatabase from './prompts/access_database';

export default class MainView {

    constructor(electronClipboard, keepassBridge, groupTree = new GroupTree(), entryList = new EntryList()) {

        groupTree.on('navigate', uuid => {
            log.debug('Group', uuid);
            keepassBridge.getGroupEntries(uuid)
                    .then(entries => entryList.show(entries))
                    .catch(this.handleErrors.bind(this));
        });

        entryList.on('navigate', function (uuid) {
            log.debug('Entry', uuid);
        });

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
            triggerEvent('reload-database');
        });

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