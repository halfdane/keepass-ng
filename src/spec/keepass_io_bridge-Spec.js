import KeepassIoBridge from '../browser/keepass_io_bridge';

function fakeKpio(groupTree = {}, entries = []) {
    let fake = {};
    fake.addCredential = sinon.spy();
    fake.loadFile = sinon.stub().callsArg(1);
    fake.getEntries = sinon.stub().returns(entries);
    fake.password = sinon.spy();
    fake.Database = () => {
        return {
            'addCredential': fake.addCredential,
            'loadFile': fake.loadFile,
            'getBasicApi': () => {
                return {
                    'getGroupTree': sinon.stub().returns(groupTree),
                    'getEntries': fake.getEntries
                };
            }
        };
    };
    fake.Credentials = {
        'Password': fake.password
    };
    return fake;
}
describe('KeepassIoBridge', () => {

    describe('creation', () => {

        it('should exist', () => {
            expect(KeepassIoBridge).to.exist;
        });

        it('should instantiate', () => {
            const bridge = new KeepassIoBridge(null, 'path', 'passwd');
            expect(bridge).to.exist;
        });
    });

    describe('groups', () => {
        function createGroup(n = 1, subGroups = []) {
            var group = {
                Name: `name${n}`,
                UUID: `uuid${n}`,
                IconID: `iconid${n}`,
                Groups: []
            };
            subGroups.forEach(g => group.Groups.push(g));

            return group;
        }

        it('should get groups from keepass', done => {
            const keepassio = fakeKpio(createGroup(1, [createGroup(2), createGroup(3)]));
            const bridge = new KeepassIoBridge(keepassio, 'path', 'passwd');

            bridge.getDatabaseGroups(groups => {
                expect(groups).to.exist;
                expect(groups).to.deep.equal(createGroup(1, [createGroup(2), createGroup(3)]));
                done();
            });
        });

        it('should use provided path and password to get groups', done => {
            const keepassio = fakeKpio();
            const bridge = new KeepassIoBridge(keepassio, 'path', 'passwd');

            bridge.getDatabaseGroups(() => {
                expect(keepassio.password).to.have.been.calledWith('passwd');
                expect(keepassio.loadFile).to.have.been.calledWith('path');
                done();
            });
        });
    });

    describe('entries', () => {
        function createEntry(n = 1) {
            return {
                'UUID': `uuid${n}`,
                'IconID': `iconId${n}`,
                'ForegroundColor': '',
                'BackgroundColor': '',
                'OverrideURL': '',
                'Tags': `tag${n}_1;tag${n}_2`,
                'Times': {
                    'CreationTime': '2013-11-11T18:49:01Z',
                    'LastModificationTime': '2013-11-11T18:49:01Z',
                    'LastAccessTime': '2013-11-11T18:49:01Z',
                    'ExpiryTime': '2013-11-11T18:47:58Z',
                    'Expires': 'False',
                    'UsageCount': '0',
                    'LocationChanged': '2013-11-11T18:49:01Z'
                },
                'String': [{'Key': 'Notes', 'Value': `notes${n}`},
                    {'Key': 'Password', 'Value': {'_': `password${n}`, '$': {'Protected': 'True'}}},
                    {'Key': 'Title', 'Value': `title${n}`}, {'Key': 'URL', 'Value': `url${n}`},
                    {'Key': 'UserName', 'Value': `username${n}`}],
                'AutoType': {
                    'Enabled': 'True',
                    'DataTransferObfuscation': '0',
                    'Association': {
                        'Window': 'Target Window',
                        'KeystrokeSequence': '{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}'
                    }
                },
                'History': ''
            };
        }

        it('should get entries from keepass', done => {
            const keepassio = fakeKpio({}, [createEntry(1)]);

            const bridge = new KeepassIoBridge(keepassio, 'path', 'passwd');

            bridge.getGroupEntries('someGroupId', entries => {
                expect(entries).to.exist;
                expect(entries[0].title).to.equal('title1');
                expect(entries[0].username).to.equal('username1');
                expect(entries[0].url).to.equal('url1');
                expect(entries[0].notes).to.equal('notes1');
                expect(entries[0].uuid).to.equal('uuid1');
                expect(entries[0].icon).to.equal('iconId1');
                expect(entries[0].tags).to.equal('tag1_1;tag1_2');

                expect(entries[0].password).not.to.equal('password1');
                done();
            });
        });

        it('should use provided path and password to get entries', done => {
            const keepassio = fakeKpio();
            const bridge = new KeepassIoBridge(keepassio, 'path', 'passwd');

            bridge.getGroupEntries('someGroupId', () => {
                expect(keepassio.password).to.have.been.calledWith('passwd');
                expect(keepassio.loadFile).to.have.been.calledWith('path');
                done();
            });
        });

        it('should use provided groupId to get entries', done => {
            const keepassio = fakeKpio();
            const bridge = new KeepassIoBridge(keepassio, 'path', 'passwd');

            bridge.getGroupEntries('someGroupId', () => {
                expect(keepassio.getEntries).to.have.been.calledWith('someGroupId');
                done();
            });
        });
    });

});

let testDatabase = {
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

it('should log', () => {
    let m = testDatabase;
    m = {};
    console.log(m);
});