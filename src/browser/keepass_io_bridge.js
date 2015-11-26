(function () {
    'use strict';

    var kpio = require('keepass.io');

    function loadDatabase(password, dbpath, loaded) {
        var db = new kpio.Database();
        db.addCredential(new kpio.Credentials.Password(password));
        // db.addCredential(new kpio.Credentials.Keyfile('apoc.key'));
        db.loadFile(dbpath, function (err) {
            if (err) {
                throw err;
            }

            loaded(db);
        });
    }

    function getDatabaseGroups(dbpath, password, callback) {
        loadDatabase(password, dbpath, function (db) {
            var basicApi = db.getBasicApi();
            var groups = basicApi.getGroupTree();
            callback(groups);
        });
    }

    var _getEntryValue = function (expectedString, entry) {
        var value = entry.String.filter(function (givenStringObject) {
            return givenStringObject.Key === expectedString;
        }).pop();
        if (!!value) {
            return value.Value;
        }
    };

    function _convertEntry(entry) {
        return {
            title: _getEntryValue('Title', entry),
            username: _getEntryValue('UserName', entry),
            password: '*****',
            url: _getEntryValue('URL', entry),
            notes: _getEntryValue('Notes', entry),
            uuid: entry.UUID,
            icon: entry.IconID,
            tags: entry.Tags
        };
    }

    function getGroupEntries(dbpath, password, groupId, callback) {
        loadDatabase(password, dbpath, function (db) {
            var basicApi = db.getBasicApi();
            var entries = basicApi.getEntries(groupId);
            callback(entries.map(_convertEntry));
        });
    }

    var rawDb = {
        'KeePassFile': {
            'Meta': {
                'Generator': 'KeePass',
                'HeaderHash': 'tWGiy9lsVsoaC4/3bW1PAx8LMX59gOeS3jr3b8GYCKQ=',
                'DatabaseName': 'an example kdbc',
                'DatabaseNameChanged': '2013-11-11T18:49:01Z',
                'DatabaseDescription': '',
                'DatabaseDescriptionChanged': '2013-11-11T18:48:35Z',
                'DefaultUserName': '',
                'DefaultUserNameChanged': '2013-11-11T18:48:35Z',
                'MaintenanceHistoryDays': '365',
                'Color': '',
                'MasterKeyChanged': '2013-11-11T18:48:35Z',
                'MasterKeyChangeRec': '-1',
                'MasterKeyChangeForce': '-1',
                'MemoryProtection': {
                    'ProtectTitle': 'False',
                    'ProtectUserName': 'False',
                    'ProtectPassword': 'True',
                    'ProtectURL': 'False',
                    'ProtectNotes': 'False'
                },
                'RecycleBinEnabled': 'True',
                'RecycleBinUUID': 'AAAAAAAAAAAAAAAAAAAAAA==',
                'RecycleBinChanged': '2013-11-11T18:48:35Z',
                'EntryTemplatesGroup': 'AAAAAAAAAAAAAAAAAAAAAA==',
                'EntryTemplatesGroupChanged': '2013-11-11T18:48:35Z',
                'HistoryMaxItems': '10',
                'HistoryMaxSize': '6291456',
                'LastSelectedGroup': 'VGxv5yLT60mvcB1baVo56w==',
                'LastTopVisibleGroup': 'n3rnRvvOF0SvPriiFXr+Tg==',
                'Binaries': '',
                'CustomData': ''
            },
            'Root': {
                'Group': {
                    'UUID': 'n3rnRvvOF0SvPriiFXr+Tg==',
                    'Name': 'example',
                    'Notes': '',
                    'IconID': '49',
                    'Times': {
                        'CreationTime': '2013-11-11T18:48:35Z',
                        'LastModificationTime': '2013-11-11T18:48:35Z',
                        'LastAccessTime': '2015-11-21T19:26:38Z',
                        'ExpiryTime': '2013-11-11T18:47:58Z',
                        'Expires': 'False',
                        'UsageCount': '8',
                        'LocationChanged': '2013-11-11T18:48:35Z'
                    },
                    'IsExpanded': 'True',
                    'DefaultAutoTypeSequence': '',
                    'EnableAutoType': 'null',
                    'EnableSearching': 'null',
                    'LastTopVisibleEntry': 'ZAw4YRw+pEic7TYfVOQ9vg==',
                    'Entry': [{
                        'UUID': 'ZAw4YRw+pEic7TYfVOQ9vg==',
                        'IconID': '0',
                        'ForegroundColor': '',
                        'BackgroundColor': '',
                        'OverrideURL': '',
                        'Tags': '',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'String': [{'Key': 'Notes', 'Value': 'Notes'},
                            {'Key': 'Password', 'Value': {'_': 'Password', '$': {'Protected': 'True'}}},
                            {'Key': 'Title', 'Value': 'Sample Entry'}, {'Key': 'URL', 'Value': 'http://keepass.info/'},
                            {'Key': 'UserName', 'Value': 'User Name'}],
                        'AutoType': {
                            'Enabled': 'True',
                            'DataTransferObfuscation': '0',
                            'Association': {
                                'Window': 'Target Window',
                                'KeystrokeSequence': '{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}'
                            }
                        },
                        'History': ''
                    }, {
                        'UUID': '245S+MhtfUaOzVPUwv4KMQ==',
                        'IconID': '0',
                        'ForegroundColor': '',
                        'BackgroundColor': '',
                        'OverrideURL': '',
                        'Tags': '',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'String': [{'Key': 'Password', 'Value': {'_': '12345', '$': {'Protected': 'True'}}},
                            {'Key': 'Title', 'Value': 'Sample Entry #2'},
                            {'Key': 'URL', 'Value': 'http://keepass.info/help/kb/testform.html'},
                            {'Key': 'UserName', 'Value': 'Michael321'}],
                        'AutoType': {
                            'Enabled': 'True',
                            'DataTransferObfuscation': '0',
                            'Association': {'Window': '*Test Form - KeePass*', 'KeystrokeSequence': ''}
                        },
                        'History': ''
                    }],
                    'Group': [{
                        'UUID': 'wXlnHFx+T0mHRYtNN+WgJg==',
                        'Name': 'General',
                        'Notes': '',
                        'IconID': '48',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2015-11-21T10:40:34Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '1',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'AAAAAAAAAAAAAAAAAAAAAA=='
                    }, {
                        'UUID': 'PtfRMFDAvkeQBJ/VTfhJ2Q==',
                        'Name': 'Windows',
                        'Notes': '',
                        'IconID': '38',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2015-11-21T19:26:38Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '6',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'XGgNkCd2WESeK0KK1K7ahg==',
                        'Entry': {
                            'UUID': 'XGgNkCd2WESeK0KK1K7ahg==',
                            'IconID': '38',
                            'ForegroundColor': '',
                            'BackgroundColor': '',
                            'OverrideURL': '',
                            'Tags': '',
                            'Times': {
                                'CreationTime': '2015-11-21T10:40:57Z',
                                'LastModificationTime': '2015-11-21T10:40:59Z',
                                'LastAccessTime': '2015-11-21T10:40:59Z',
                                'ExpiryTime': '2015-11-21T10:40:17Z',
                                'Expires': 'False',
                                'UsageCount': '1',
                                'LocationChanged': '2015-11-21T10:40:57Z'
                            },
                            'String': [{'Key': 'Notes', 'Value': ''},
                                {'Key': 'Password', 'Value': {'_': 'kyFKNwuVRni4pvxhveJm', '$': {'Protected': 'True'}}},
                                {'Key': 'Title', 'Value': 'test'}, {'Key': 'URL', 'Value': ''}, {'Key': 'UserName', 'Value': ''}],
                            'AutoType': {'Enabled': 'True', 'DataTransferObfuscation': '0'},
                            'History': ''
                        },
                        'Group': {
                            'UUID': 'VGxv5yLT60mvcB1baVo56w==',
                            'Name': 'windowsSubGroup',
                            'Notes': 'someGroupNotes',
                            'IconID': '48',
                            'Times': {
                                'CreationTime': '2015-11-21T19:25:28Z',
                                'LastModificationTime': '2015-11-21T19:26:48Z',
                                'LastAccessTime': '2015-11-21T19:26:48Z',
                                'ExpiryTime': '2015-11-20T23:00:00Z',
                                'Expires': 'True',
                                'UsageCount': '4',
                                'LocationChanged': '2015-11-21T19:25:28Z'
                            },
                            'IsExpanded': 'True',
                            'DefaultAutoTypeSequence': '{TAB} {ENTER} {UP} {DOWN} {',
                            'EnableAutoType': 'null',
                            'EnableSearching': 'null',
                            'LastTopVisibleEntry': 'kGrsiQCqAkeTpaguAP8s4Q==',
                            'Entry': {
                                'UUID': 'kGrsiQCqAkeTpaguAP8s4Q==',
                                'IconID': '0',
                                'ForegroundColor': '',
                                'BackgroundColor': '',
                                'OverrideURL': '',
                                'Tags': 'tag1;tag2',
                                'Times': {
                                    'CreationTime': '2015-11-21T19:26:51Z',
                                    'LastModificationTime': '2015-11-21T19:27:55Z',
                                    'LastAccessTime': '2015-11-21T19:27:55Z',
                                    'ExpiryTime': '2015-11-20T23:00:00Z',
                                    'Expires': 'True',
                                    'UsageCount': '1',
                                    'LocationChanged': '2015-11-21T19:26:51Z'
                                },
                                'String': [{'Key': 'aField01', 'Value': 'aValue01'},
                                    {'Key': 'aField02', 'Value': {'_': 'aValue02', '$': {'Protected': 'True'}}},
                                    {'Key': 'Notes', 'Value': 'someNotes'},
                                    {'Key': 'Password', 'Value': {'_': 'somePass', '$': {'Protected': 'True'}}},
                                    {'Key': 'Title', 'Value': 'someSubEntry'}, {'Key': 'URL', 'Value': 'theUrl'},
                                    {'Key': 'UserName', 'Value': 'userName'}],
                                'AutoType': {'Enabled': 'True', 'DataTransferObfuscation': '0'},
                                'History': ''
                            }
                        }
                    }, {
                        'UUID': 'wjSRP+QXoU+DqHcoyJriMg==',
                        'Name': 'Network',
                        'Notes': '',
                        'IconID': '3',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'AAAAAAAAAAAAAAAAAAAAAA=='
                    }, {
                        'UUID': 'LioZCHxIlU6PH1aIMd24ow==',
                        'Name': 'Internet',
                        'Notes': '',
                        'IconID': '1',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'AAAAAAAAAAAAAAAAAAAAAA=='
                    }, {
                        'UUID': 'pQZId+QEuEWzdGipwbiqBg==',
                        'Name': 'eMail',
                        'Notes': '',
                        'IconID': '19',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'AAAAAAAAAAAAAAAAAAAAAA=='
                    }, {
                        'UUID': 'I+Oc014W5kahembqd91ofA==',
                        'Name': 'Homebanking',
                        'Notes': '',
                        'IconID': '37',
                        'Times': {
                            'CreationTime': '2013-11-11T18:49:01Z',
                            'LastModificationTime': '2013-11-11T18:49:01Z',
                            'LastAccessTime': '2013-11-11T18:49:01Z',
                            'ExpiryTime': '2013-11-11T18:47:58Z',
                            'Expires': 'False',
                            'UsageCount': '0',
                            'LocationChanged': '2013-11-11T18:49:01Z'
                        },
                        'IsExpanded': 'True',
                        'DefaultAutoTypeSequence': '',
                        'EnableAutoType': 'null',
                        'EnableSearching': 'null',
                        'LastTopVisibleEntry': 'AAAAAAAAAAAAAAAAAAAAAA=='
                    }]
                }, 'DeletedObjects': ''
            }
        }
    };

    function getPassword(dbpath, password, entryId, callback) {
        loadDatabase(password, dbpath, function (db) {
            var rawApi = db.getRawApi();

            console.log(rawApi.get());
            callback('I don\'t get the passwords yet :P');
        });
    }

    function matchEntries(dbpath, password, userinput, callback) {
        callback('nothing here');
    }

    module.exports = {
        getDatabaseGroups: getDatabaseGroups,
        getGroupEntries: getGroupEntries,
        getPassword: getPassword,
        matchEntries: matchEntries
    };
}());